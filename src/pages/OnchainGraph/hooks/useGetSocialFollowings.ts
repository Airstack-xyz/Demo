import { fetchQueryWithPagination } from '@airstack/airstack-react';
import { socialFollowingsQuery } from '../../../queries/onChainGraph/followings';
import { FollowingAddress, SocialQueryResponse } from '../types/social';
import { useCallback, useRef } from 'react';
import { QUERY_LIMIT } from '../constants';
import { RecommendedUser } from '../types';
import { useOnChainGraphData } from './useOnChainGraphData';
import { paginateRequest } from '../utils';

const MAX_ITEMS = 10000;

function formatData(
  followings: FollowingAddress[],
  exitingUser: RecommendedUser[] = [],
  dappName: 'farcaster' | 'lens' = 'farcaster'
): RecommendedUser[] {
  const recommendedUsers: RecommendedUser[] = [...exitingUser];
  const followingKey =
    dappName === 'farcaster' ? 'followingOnFarcaster' : 'followingOnLens';
  const followedOnKey =
    dappName === 'farcaster' ? 'followedOnFarcaster' : 'followedOnLens';
  for (const following of followings) {
    const existingUserIndex = recommendedUsers.findIndex(
      ({ addresses: recommendedUsersAddresses }) =>
        recommendedUsersAddresses?.some?.(address =>
          following.addresses?.includes?.(address)
        )
    );

    const followsBack = Boolean(following?.mutualFollower?.Follower?.[0]);
    if (existingUserIndex !== -1) {
      const follows = recommendedUsers?.[existingUserIndex]?.follows ?? {};
      recommendedUsers[existingUserIndex] = {
        ...following,
        ...recommendedUsers[existingUserIndex],
        follows: {
          ...follows,
          [followingKey]: true,
          [followedOnKey]: followsBack
        }
      };
      if (dappName === 'farcaster') {
        recommendedUsers[existingUserIndex]._farcasterAddresses = [
          ...(recommendedUsers[existingUserIndex]._farcasterAddresses || []),
          ...following.addresses
        ]?.filter((address, index, array) => array.indexOf(address) === index);
      }
    } else {
      recommendedUsers.push({
        ...following,
        _farcasterAddresses:
          dappName === 'farcaster' ? following.addresses : [],
        follows: {
          [followingKey]: true,
          [followedOnKey]: followsBack
        }
      });
    }
  }
  return recommendedUsers;
}

export function useGetSocialFollowings(
  address: string,
  dappName: 'farcaster' | 'lens' = 'farcaster'
) {
  const requestCanceled = useRef(false);
  const totalItemsCount = useRef(0);
  const { setData, setTotalScannedDocuments } = useOnChainGraphData();

  const fetchData = useCallback(async () => {
    if (requestCanceled.current) {
      return;
    }
    const request = fetchQueryWithPagination<SocialQueryResponse>(
      socialFollowingsQuery,
      {
        user: address,
        dappName
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
      const followings =
        data?.SocialFollowings?.Following?.map(
          following => following.followingAddress
        ) ?? [];
      totalItemsCount.current += followings.length;
      setData(recommendedUsers =>
        formatData(followings, recommendedUsers, dappName)
      );
      const shouldFetchMore = totalItemsCount.current < MAX_ITEMS;
      if (shouldFetchMore) {
        setTotalScannedDocuments(count => count + QUERY_LIMIT);
      }
      return shouldFetchMore;
    });
  }, [address, dappName, setData, setTotalScannedDocuments]);

  const cancelRequest = useCallback(() => {
    requestCanceled.current = true;
  }, []);

  return [fetchData, cancelRequest] as const;
}
