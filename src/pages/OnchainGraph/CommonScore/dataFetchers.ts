import { fetchQuery, fetchQueryWithPagination } from '@airstack/airstack-react';
import { paginateRequest } from '../utils';
import {
  CommonPoapType,
  CommonTokenType,
  Wallet
} from '../../TokenBalances/types';
import { nftsToIgnore } from '../constants';
import { commonNFTTokens } from '../../../queries/onChainGraphForTwoAddresses/common-nfts';
import { commonPoapsQuery } from '../../../queries/onChainGraphForTwoAddresses/common-poaps';
import { mutualFollower } from '../../../queries/onChainGraphForTwoAddresses/followings';
import { Following, SocialQueryResponse } from '../types/social';
import { TokenQueryResponse } from '../types/tokenSentReceived';
import { tokenSentQuery } from '../../../queries/onChainGraphForTwoAddresses/tokens';
import { SocialQuery } from '../../../queries';

export async function fetchNfts(
  address: string[],
  onCountChange?: ({
    ethCount,
    polygonCount
  }: {
    ethCount: number;
    polygonCount: number;
  }) => void
) {
  let ethCount = 0;
  let polygonCount = 0;
  const visited = new Set<string>();

  const request = fetchQueryWithPagination(commonNFTTokens, {
    identity: address[0],
    identity2: address[1]
  });

  await paginateRequest(request, async data => {
    const { ethereum, polygon } = data;
    let ethTokens: CommonTokenType[] = ethereum?.TokenBalance || [];
    let maticTokens: CommonTokenType[] = polygon?.TokenBalance || [];

    if (ethTokens.length > 0) {
      ethTokens = ethTokens.filter(token => {
        if (nftsToIgnore.includes(token?.tokenAddress)) return false;

        const isDuplicate = visited.has(token?.tokenAddress);
        visited.add(token?.tokenAddress);
        return Boolean(token?.token?.tokenBalances?.length) && !isDuplicate;
      });
    }
    if (maticTokens.length > 0) {
      maticTokens = maticTokens.filter(token => {
        if (nftsToIgnore.includes(token?.tokenAddress)) return false;
        const isDuplicate = visited.has(token?.tokenAddress);
        visited.add(token?.tokenAddress);
        return Boolean(token?.token?.tokenBalances?.length) && !isDuplicate;
      });
    }

    ethCount += ethTokens.length;
    polygonCount += maticTokens.length;

    onCountChange?.({
      ethCount,
      polygonCount
    });

    return true;
  });
  return {
    ethCount,
    polygonCount
  };
}

export async function fetchPoaps(
  address: string[],
  onCountChange?: (count: number) => void
) {
  let count = 0;

  const request = fetchQueryWithPagination(commonPoapsQuery, {
    identity: address[0],
    identity2: address[1]
  });

  await paginateRequest(request, async data => {
    let poaps = data?.Poaps?.Poap || [];
    if (poaps.length > 0) {
      poaps = poaps.reduce((items: CommonPoapType[], poap: CommonPoapType) => {
        if (poap.poapEvent.poaps?.length > 0) {
          items.push(poap);
        }
        return items;
      }, []);
    }
    count += poaps.length;
    onCountChange?.(count);
    return true;
  });
  return count;
}

export async function fetchTokensTransfer(address: string[]) {
  let tokenSent = false;
  let tokenReceived = false;

  const { data } = await fetchQueryWithPagination<TokenQueryResponse>(
    tokenSentQuery,
    {
      to: address[0],
      from: address[1]
    }
  );
  if (data?.Ethereum?.TokenTransfer?.length) {
    tokenSent = true;
  }

  if (data?.Polygon?.TokenTransfer?.length) {
    tokenSent = true;
  }

  const { data: data2 } = await fetchQueryWithPagination<TokenQueryResponse>(
    tokenSentQuery,
    {
      to: address[1],
      from: address[0]
    }
  );
  if (data2?.Ethereum?.TokenTransfer?.length) {
    tokenReceived = true;
  }

  if (data2?.Polygon?.TokenTransfer?.length) {
    tokenReceived = true;
  }
  return { tokenSent, tokenReceived };
}

export async function fetchMutualFollowings(address: string[]) {
  const lens = {
    following: false,
    followedBy: false
  };

  const farcaster = {
    following: false,
    followedBy: false
  };

  function checkIsFollowing(followings: Following[], address: string) {
    let isFollowing = false;
    let followedBy = false;
    for (const following of followings) {
      if (!following.followingAddress) {
        continue;
      }
      let match = following.followingAddress.addresses.some(x => x === address);
      match =
        match ||
        Boolean(
          following.followingAddress.domains?.some(x => x.name === address)
        );

      // console.log({ domains: following.followingAddress.domains });

      if (match) {
        isFollowing = true;
        followedBy =
          following.followingAddress?.mutualFollower?.Follower?.length > 0;
        break;
      }
    }
    return [isFollowing, followedBy];
  }

  const request = fetchQueryWithPagination<{
    farcasterFollowing: SocialQueryResponse['SocialFollowings'];
    lensFollowing: SocialQueryResponse['SocialFollowings'];
  }>(mutualFollower, {
    user: address[0]
  });

  await paginateRequest(request, async data => {
    const [isFollowingFarcaster, followedByFarcaster] = checkIsFollowing(
      data?.farcasterFollowing?.Following || [],
      address[1]
    );
    const [isFollowingOnLens, followedOnLens] = checkIsFollowing(
      data?.lensFollowing?.Following || [],
      address[1]
    );

    lens.following = lens.following || isFollowingOnLens;
    lens.followedBy = lens.followedBy || followedOnLens;
    farcaster.following = farcaster.following || isFollowingFarcaster;
    farcaster.followedBy = farcaster.followedBy || followedByFarcaster;

    if (isFollowingFarcaster && isFollowingOnLens) {
      return false;
    }

    return true;
  });

  if (farcaster.followedBy && lens.followedBy) {
    return {
      lens,
      farcaster
    };
  }

  const request2 = fetchQueryWithPagination<{
    farcasterFollowing: SocialQueryResponse['SocialFollowings'];
    lensFollowing: SocialQueryResponse['SocialFollowings'];
  }>(mutualFollower, {
    user: address[1]
  });

  await paginateRequest(request2, async data => {
    const [isFollowingFarcaster] = checkIsFollowing(
      data?.farcasterFollowing?.Following || [],
      address[0]
    );
    const [isFollowingOnLens] = checkIsFollowing(
      data?.lensFollowing?.Following || [],
      address[0]
    );
    // is address2 following address1, so add it to followedBy
    lens.followedBy = lens.followedBy || isFollowingOnLens;
    farcaster.followedBy = farcaster.followedBy || isFollowingFarcaster;

    if (isFollowingFarcaster && isFollowingOnLens) {
      return false;
    }

    return true;
  });
  return {
    lens,
    farcaster
  };
}

export async function getDomainName(identity: string) {
  const { data } = await fetchQuery<{
    Wallet: Wallet;
  }>(SocialQuery, {
    identity
  });

  return data?.Wallet || null;
}
