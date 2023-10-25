import { fetchQueryWithPagination } from '@airstack/airstack-react';
import { socialFollowersQuery } from '../../../queries/onChainGraph/followings';
import { FollowingAddress, SocialQueryResponse } from '../types/social';
import { useCallback, useRef } from 'react';
import { QUERY_LIMIT } from '../constants';
import { RecommendedUser } from '../types';
import { useOnChainGraphData } from './useOnChainGraphData';
import { paginateRequest } from '../utils';

const MAX_ITEMS = 10000;

function formatData(
  followers: FollowingAddress[],
  exitingUser: RecommendedUser[] = [],
  dappName: 'farcaster' | 'lens' = 'farcaster'
): RecommendedUser[] {
  const recommendedUsers: RecommendedUser[] = [...exitingUser];
  const followingKey =
    dappName === 'farcaster' ? 'followingOnFarcaster' : 'followingOnLens';
  const followedOnKey =
    dappName === 'farcaster' ? 'followedOnFarcaster' : 'followedOnLens';

  for (const follower of followers) {
    const existingUserIndex = recommendedUsers.findIndex(
      ({ addresses: recommendedUsersAddresses }) =>
        recommendedUsersAddresses?.some?.(address =>
          follower.addresses?.includes?.(address)
        )
    );

    const following = Boolean(follower?.mutualFollower?.Following?.length);

    if (existingUserIndex !== -1) {
      const follows = recommendedUsers?.[existingUserIndex]?.follows ?? {};

      follows[followedOnKey] = true;
      follows[followingKey] = follows[followingKey] || following;

      recommendedUsers[existingUserIndex] = {
        ...follower,
        ...recommendedUsers[existingUserIndex],
        follows
      };
      if (dappName === 'farcaster') {
        recommendedUsers[existingUserIndex]._farcasterAddresses = [
          ...(recommendedUsers[existingUserIndex]._farcasterAddresses || []),
          ...follower.addresses
        ]?.filter((address, index, array) => array.indexOf(address) === index);
      }
    } else {
      recommendedUsers.push({
        ...follower,
        _farcasterAddresses: dappName === 'farcaster' ? follower.addresses : [],
        follows: {
          [followingKey]: following,
          [followedOnKey]: true
        }
      });
    }
  }
  return recommendedUsers;
}

export function useGetSocialFollowers(
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
      socialFollowersQuery,
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
      const followers =
        data?.SocialFollowers?.Follower?.map(
          following => following.followerAddress
        ) ?? [];
      totalItemsCount.current += followers.length;
      setData(recommendedUsers =>
        formatData(followers, recommendedUsers, dappName)
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
