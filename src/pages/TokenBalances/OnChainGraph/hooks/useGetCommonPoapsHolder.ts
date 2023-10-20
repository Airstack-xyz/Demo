import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import {
  poapsByEventIdsQuery,
  userPoapsEventIdsQuery
} from '../../../../queries/onChainGraph/commonPoaps';
import { useEffect, useRef } from 'react';
import { MAX_ITEMS } from '../constants';
import {
  Poap,
  PoapsByEventIdsQueryResponse,
  UserPoapsEventIdsQueryResponse
} from '../types/common-poaps';
import { RecommendedUser } from '../types';
import { useOnChainGraphData } from './useOnChainGraphData';

function formatData(
  poaps: Poap[],
  exitingUser: RecommendedUser[] = []
): RecommendedUser[] {
  const recommendedUsers: RecommendedUser[] = [...exitingUser];
  for (const poap of poaps ?? []) {
    const { attendee, poapEvent, eventId } = poap ?? {};
    const { eventName: name, contentValue } = poapEvent ?? {};
    const { addresses } = attendee?.owner ?? {};
    const existingUserIndex = recommendedUsers.findIndex(
      ({ addresses: recommendedUsersAddresses }) =>
        recommendedUsersAddresses?.some?.(address =>
          addresses?.includes?.(address)
        )
    );
    if (existingUserIndex !== -1) {
      recommendedUsers[existingUserIndex].addresses = [
        ...(recommendedUsers?.[existingUserIndex]?.addresses ?? []),
        ...addresses
      ]?.filter((address, index, array) => array.indexOf(address) === index);
      const _poaps = recommendedUsers?.[existingUserIndex]?.poaps || [];
      recommendedUsers[existingUserIndex].poaps = [
        ..._poaps,
        { name, image: contentValue?.image?.extraSmall, eventId }
      ];
    } else {
      recommendedUsers.push({
        ...(attendee?.owner ?? {}),
        poaps: [{ name, image: contentValue?.image?.extraSmall, eventId }]
      });
    }
  }
  return recommendedUsers;
}

export function useGetCommonPoapsHolder(address: string) {
  const { setData } = useOnChainGraphData();

  const eventIdsRef = useRef<string[]>([]);
  const totalItemsCount = useRef(0);
  const [
    fetch,
    {
      data: eventIds,
      loading: loadingEventIds,
      error: eventIdError,
      pagination: eventIdPagination
    }
  ] = useLazyQueryWithPagination(
    userPoapsEventIdsQuery,
    { user: address },
    {
      dataFormatter(data: UserPoapsEventIdsQueryResponse) {
        const newIds = data.Poaps.Poap.map(poap => poap.eventId);
        eventIdsRef.current = [...eventIdsRef.current, ...newIds];
        return eventIdsRef.current;
      }
    }
  );
  const [
    fetchPoaps,
    {
      data: poapOwners,
      loading: loadingPoaps,
      error: poapsError,
      pagination: poapsPagination
    }
  ] = useLazyQueryWithPagination(
    poapsByEventIdsQuery,
    {},
    {
      dataFormatter: (data: PoapsByEventIdsQueryResponse) => {
        totalItemsCount.current += data?.Poaps?.Poap?.length ?? 0;

        return data.Poaps.Poap;
      },
      onCompleted(poaps) {
        setData(recommendedUsers => formatData(poaps, recommendedUsers));
      }
    }
  );

  useEffect(() => {
    if (eventIds) {
      fetchPoaps({ poaps: eventIds });
    }
  }, [eventIds, fetchPoaps]);

  const reachedPoapsLimit = totalItemsCount.current >= MAX_ITEMS;

  useEffect(() => {
    if (reachedPoapsLimit) {
      console.log(' limit reached for poaps');
      return;
    }

    // if we have more poaps to fetch, fetch them
    if (poapsPagination.hasNextPage && !loadingPoaps) {
      poapsPagination.getNextPage();
      return;
    }

    // if we have more eventIds to fetch, fetch them, once we're done fetching poaps
    if (
      !poapsPagination.hasNextPage &&
      !loadingEventIds &&
      eventIdPagination.hasNextPage
    ) {
      eventIdPagination.getNextPage();
    }
  }, [
    eventIdPagination,
    loadingEventIds,
    loadingPoaps,
    poapsPagination,
    reachedPoapsLimit
  ]);

  return [
    fetch,
    poapOwners,
    reachedPoapsLimit,
    loadingEventIds || loadingPoaps,
    eventIdError || poapsError
  ] as const;
}
