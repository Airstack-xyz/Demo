import { fetchQueryWithPagination } from '@airstack/airstack-react';
import { socialFollowingsQuery } from '../../../../queries/onChainGraph/followings';
import { FollowingAddress, SocialQueryResponse } from '../types/social';
import { useCallback, useRef } from 'react';
import { MAX_ITEMS, QUERY_LIMIT } from '../constants';
import { RecommendedUser } from '../types';
import { useOnChainGraphData } from './useOnChainGraphData';

function formatData(
  followings: FollowingAddress[],
  exitingUser: RecommendedUser[] = [],
  dappName: 'farcaster' | 'lens' = 'farcaster'
): RecommendedUser[] {
  const recommendedUsers: RecommendedUser[] = [...exitingUser];
  for (const following of followings) {
    const existingUserIndex = recommendedUsers.findIndex(
      ({ addresses: recommendedUsersAddresses }) =>
        recommendedUsersAddresses?.some?.(address =>
          following.addresses?.includes?.(address)
        )
    );
    const followingKey =
      dappName === 'farcaster' ? 'followingOnFarcaster' : 'followingOnLens';
    const followedOnKey =
      dappName === 'farcaster' ? 'followedOnFarcaster' : 'followedOnLens';

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
    } else {
      recommendedUsers.push({
        ...following,
        follows: {
          followingOnLens: true,
          followedOnLens: followsBack
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
  const totalItemsFetchedRef = useRef(0);
  const { setData, setTotalScannedDocuments } = useOnChainGraphData();

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
        await fetchQueryWithPagination<SocialQueryResponse>(
          socialFollowingsQuery,
          {
            user: address,
            dappName
          }
        );

      pagination.hasNextPage = hasNextPage;
      pagination.getNextPage = getNextPage;
      if (!data) break;
      const followings = data.SocialFollowings.Following.map(
        following => following.followingAddress
      );
      totalItemsFetchedRef.current += followings.length;
      setData(recommendedUsers =>
        formatData(followings, recommendedUsers, dappName)
      );
    } while (
      pagination.hasNextPage &&
      totalItemsFetchedRef.current >= MAX_ITEMS
    );
  }, [address, dappName, setData, setTotalScannedDocuments]);

  return [fetchData] as const;
}
