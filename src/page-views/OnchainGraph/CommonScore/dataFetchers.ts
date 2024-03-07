import { fetchQuery, fetchQueryWithPagination } from '@airstack/airstack-react';
import { tokenBlockchains } from '../../../constants';
import { SocialQuery } from '../../../queries';
import { commonNFTTokens } from '../../../queries/onChainGraphForTwoAddresses/common-nfts';
import { commonPoapsQuery } from '../../../queries/onChainGraphForTwoAddresses/common-poaps';
import { mutualFollower } from '../../../queries/onChainGraphForTwoAddresses/followings';
import { tokenSentQuery } from '../../../queries/onChainGraphForTwoAddresses/tokens';
import {
  CommonPoapType,
  CommonTokenType,
  Wallet
} from '../../TokenBalances/types';
import { nftsToIgnore } from '../constants';
import { CommonPoapsQueryResponse } from '../types/common-poaps';
import { CommonNFTQueryResponse, NFTCountData } from '../types/nft';
import { Following, SocialQueryResponse } from '../types/social';
import { TokenQueryResponse } from '../types/tokenSentReceived';
import { paginateRequest } from '../utils';

const processTokens = (tokens: CommonTokenType[], visited: Set<string>) => {
  if (tokens.length > 0) {
    tokens = tokens.filter(token => {
      if (nftsToIgnore.includes(token?.tokenAddress)) return false;
      const isDuplicate = visited.has(token?.tokenAddress);
      visited.add(token?.tokenAddress);
      return Boolean(token?.token?.tokenBalances?.length) && !isDuplicate;
    });
  }
  return tokens;
};

export async function fetchNfts(
  address: string[],
  onCountChange?: (params: NFTCountData) => void
): Promise<NFTCountData> {
  let ethereumCount = 0;
  let polygonCount = 0;
  let baseCount = 0;
  let zoraCount = 0;
  const visited = new Set<string>();

  const request = fetchQueryWithPagination<CommonNFTQueryResponse>(
    commonNFTTokens,
    {
      identity1: address[0],
      identity2: address[1]
    }
  );

  await paginateRequest(request, async data => {
    if (!data) {
      return false;
    }
    const { ethereum, polygon, base, zora } = data;
    let ethereumBalances = ethereum?.TokenBalance || [];
    let polygonBalances = polygon?.TokenBalance || [];
    let baseBalances = base?.TokenBalance || [];
    let zoraBalances = zora?.TokenBalance || [];

    ethereumBalances = processTokens(ethereumBalances, visited);
    polygonBalances = processTokens(polygonBalances, visited);
    baseBalances = processTokens(baseBalances, visited);
    zoraBalances = processTokens(zoraBalances, visited);

    ethereumCount += ethereumBalances.length;
    polygonCount += polygonBalances.length;
    baseCount += baseBalances.length;
    zoraCount += zoraBalances.length;

    onCountChange?.({
      ethereumCount,
      polygonCount,
      baseCount,
      zoraCount
    });

    return true;
  });
  return {
    ethereumCount,
    polygonCount,
    baseCount,
    zoraCount
  };
}

export async function fetchPoaps(
  address: string[],
  onCountChange?: (count: number) => void
) {
  let count = 0;

  const request = fetchQueryWithPagination<CommonPoapsQueryResponse>(
    commonPoapsQuery,
    {
      identity1: address[0],
      identity2: address[1]
    }
  );

  await paginateRequest(request, async data => {
    if (!data) {
      return false;
    }
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

  tokenSent = tokenBlockchains.some(
    blockchain => data?.[blockchain]?.TokenTransfer?.length
  );

  const { data: data2 } = await fetchQueryWithPagination<TokenQueryResponse>(
    tokenSentQuery,
    {
      to: address[1],
      from: address[0]
    }
  );

  tokenReceived = tokenBlockchains.some(
    blockchain => data2?.[blockchain]?.TokenTransfer?.length
  );

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
      let match = following.followingAddress?.addresses?.some(
        x => x === address
      );
      match =
        match ||
        Boolean(
          following.followingAddress?.domains?.some(x => x.name === address)
        );

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
