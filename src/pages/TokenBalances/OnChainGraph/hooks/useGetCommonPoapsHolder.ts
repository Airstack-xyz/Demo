import { fetchQueryWithPagination } from '@airstack/airstack-react';
import {
  poapsByEventIdsQuery,
  userPoapsEventIdsQuery
} from '../../../../queries/onChainGraph/commonPoaps';
import { useCallback, useRef } from 'react';
import { MAX_ITEMS, QUERY_LIMIT } from '../constants';
import {
  Poap,
  PoapsByEventIdsQueryResponse,
  UserPoapsEventIdsQueryResponse
} from '../types/common-poaps';
import { RecommendedUser } from '../types';
import { useOnChainGraphData } from './useOnChainGraphData';
import { paginateRequest } from '../utils';

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
      const poapExists = _poaps.some(poap => poap.eventId === eventId);
      if (!poapExists) {
        _poaps?.push({ name, image: contentValue?.image?.extraSmall, eventId });
        recommendedUsers[existingUserIndex].poaps = [..._poaps];
      }
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
  const { setData, setTotalScannedDocuments } = useOnChainGraphData();
  const totalItemsCount = useRef(0);

  const fetchPoapData = useCallback(
    async (eventIds: string[]) => {
      const request = fetchQueryWithPagination<PoapsByEventIdsQueryResponse>(
        poapsByEventIdsQuery,
        {
          user: address,
          poaps: eventIds
        },
        {
          cache: false
        }
      );
      setTotalScannedDocuments(count => count + QUERY_LIMIT);
      await paginateRequest(request, async data => {
        const poaps = data?.Poaps.Poap;
        totalItemsCount.current += data?.Poaps?.Poap?.length ?? 0;
        setData(recommendedUsers => formatData(poaps || [], recommendedUsers));
        const shouldFetchMore = totalItemsCount.current < MAX_ITEMS;
        if (shouldFetchMore) {
          setTotalScannedDocuments(count => count + QUERY_LIMIT);
        }
        return shouldFetchMore;
      });
    },
    [address, setData, setTotalScannedDocuments]
  );

  const fetchData = useCallback(async () => {
    const request = fetchQueryWithPagination<UserPoapsEventIdsQueryResponse>(
      userPoapsEventIdsQuery,
      {
        user: address
      },
      {
        cache: false
      }
    );
    setTotalScannedDocuments(count => count + QUERY_LIMIT);
    await paginateRequest(request, async data => {
      const eventIds = data?.Poaps.Poap.map(poap => poap.eventId) ?? [];
      await await fetchPoapData(eventIds);
      const shouldFetchMore = totalItemsCount.current < MAX_ITEMS;
      if (shouldFetchMore) {
        setTotalScannedDocuments(count => count + QUERY_LIMIT);
      }
      return shouldFetchMore;
    });
  }, [address, fetchPoapData, setTotalScannedDocuments]);

  return [fetchData] as const;
}
