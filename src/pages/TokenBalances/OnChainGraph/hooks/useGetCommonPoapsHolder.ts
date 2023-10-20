import {
  fetchQueryWithPagination,
  useLazyQueryWithPagination
} from '@airstack/airstack-react';
import {
  poapsByEventIdsQuery,
  userPoapsEventIdsQuery
} from '../../../../queries/onChainGraph/commonPoaps';
import { useCallback, useEffect, useRef } from 'react';
import { MAX_ITEMS, QUERY_LIMIT } from '../constants';
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
      const pagination = {
        hasNextPage: false,
        getNextPage: () => {
          // empty function
        }
      };
      do {
        setTotalScannedDocuments(count => count + QUERY_LIMIT);
        const { data, hasNextPage, getNextPage } =
          await fetchQueryWithPagination<PoapsByEventIdsQueryResponse>(
            poapsByEventIdsQuery,
            {
              user: address,
              poaps: eventIds
            }
          );
        totalItemsCount.current += data?.Poaps?.Poap?.length ?? 0;
        pagination.hasNextPage = hasNextPage;
        pagination.getNextPage = getNextPage;
        if (!data) {
          break;
        }
        const poaps = data.Poaps.Poap;
        setData(recommendedUsers => formatData(poaps, recommendedUsers));
      } while (pagination.hasNextPage && totalItemsCount.current < MAX_ITEMS);
    },
    [address, setData, setTotalScannedDocuments]
  );

  const fetchData = useCallback(async () => {
    const pagination = {
      hasNextPage: false,
      getNextPage: () => {
        // empty function
      }
    };
    do {
      setTotalScannedDocuments(count => count + QUERY_LIMIT);
      const { data, hasNextPage, getNextPage } =
        await fetchQueryWithPagination<UserPoapsEventIdsQueryResponse>(
          userPoapsEventIdsQuery,
          {
            user: address
          }
        );
      pagination.hasNextPage = hasNextPage;
      pagination.getNextPage = getNextPage;
      if (!data) break;
      const eventIds = data.Poaps.Poap.map(poap => poap.eventId);
      await fetchPoapData(eventIds);
    } while (pagination.hasNextPage && totalItemsCount.current < MAX_ITEMS);
  }, [address, fetchPoapData, setTotalScannedDocuments]);

  return [fetchData] as const;
}
