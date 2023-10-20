import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { socialFollowingsQuery } from '../../../../queries/onChainGraph/followings';
import { FollowingAddress, SocialQueryResponse } from '../types/social';
import { useEffect, useRef } from 'react';
import { MAX_ITEMS } from '../constants';
import { RecommendedUser } from '../types';
import { useOnChainGraphData } from './useOnChainGraphData';

function formatData(
  followings: FollowingAddress[],
  exitingUser: RecommendedUser[] = []
): RecommendedUser[] {
  const recommendedUsers: RecommendedUser[] = [...exitingUser];
  for (const following of followings) {
    const existingUserIndex = recommendedUsers.findIndex(
      ({ addresses: recommendedUsersAddresses }) =>
        recommendedUsersAddresses?.some?.(address =>
          following.addresses?.includes?.(address)
        )
    );
    const followsBack = Boolean(following?.mutualFollower?.Follower?.[0]);
    if (existingUserIndex !== -1) {
      recommendedUsers[existingUserIndex] = {
        ...following,
        ...recommendedUsers[existingUserIndex],
        follows: { followingOnLens: true, followedOnLens: followsBack }
      };
    } else {
      recommendedUsers.push({
        ...following,
        follows: { followingOnLens: true, followedOnLens: followsBack }
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
  const { setData } = useOnChainGraphData();
  const [fetch, { data, loading, error, pagination }] =
    useLazyQueryWithPagination<FollowingAddress[]>(
      socialFollowingsQuery,
      {
        user: address,
        dappName
      },
      {
        dataFormatter(data: SocialQueryResponse) {
          const followings = data.SocialFollowings.Following.map(
            following => following.followingAddress
          );
          totalItemsFetchedRef.current += followings.length;
          return followings;
        },
        onCompleted(data) {
          setData(recommendedUsers => formatData(data, recommendedUsers));
        }
      }
    );

  const limitReached = totalItemsFetchedRef.current >= MAX_ITEMS;

  useEffect(() => {
    if (limitReached) {
      console.log('limit reached for social followings');
      return;
    }

    if (!loading && pagination.hasNextPage) {
      pagination.getNextPage();
    }
  }, [limitReached, loading, pagination]);

  return [fetch, data, error, loading];
}
