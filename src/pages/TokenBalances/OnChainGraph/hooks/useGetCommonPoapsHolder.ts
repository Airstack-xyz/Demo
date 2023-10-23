import { fetchQueryWithPagination } from '@airstack/airstack-react';
import {
  poapsByEventIdsQuery,
  userPoapsEventIdsQuery
} from '../../../../queries/onChainGraph/commonPoaps';
import { useCallback, useRef } from 'react';
import { QUERY_LIMIT } from '../constants';
import {
  Poap,
  PoapsByEventIdsQueryResponse,
  UserPoapsEventIdsQueryResponse
} from '../types/common-poaps';
import { RecommendedUser } from '../types';
import { useOnChainGraphData } from './useOnChainGraphData';
import { paginateRequest } from '../utils';

const MAX_ITEMS = Infinity;

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
  const requestCanceled = useRef(false);
  const { setData, setTotalScannedDocuments } = useOnChainGraphData();
  const totalItemsCount = useRef(0);

  const fetchPoapData = useCallback(
    async (eventIds: string[]) => {
      if (requestCanceled.current) {
        return;
      }
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
        if (requestCanceled.current) {
          return false;
        }
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
    if (requestCanceled.current) {
      return;
    }
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
      if (requestCanceled.current) {
        return false;
      }
      const eventIds =
        data?.Poaps.Poap.filter(poap => !poap?.poapEvent?.isVirtualEvent).map(
          poap => poap?.eventId
        ) ?? [];
      await await fetchPoapData(eventIds);
      const shouldFetchMore = totalItemsCount.current < MAX_ITEMS;
      if (shouldFetchMore) {
        setTotalScannedDocuments(count => count + QUERY_LIMIT);
      }
      return shouldFetchMore;
    });
  }, [address, fetchPoapData, setTotalScannedDocuments]);

  const cancelRequest = useCallback(() => {
    requestCanceled.current = true;
  }, []);

  return [fetchData, cancelRequest] as const;
}
