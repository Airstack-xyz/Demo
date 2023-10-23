import { useEffect, useState } from 'react';
import { fetchQueryWithPagination } from '@airstack/airstack-react';
import { paginateRequest } from '../OnChainGraph/utils';
import { CommonPoapType, CommonTokenType } from '../types';
import { useSearchInput } from '../../../hooks/useSearchInput';
import { commonPoapsQuery } from './common-score/poapsOfCommonOwnersQuery';
import { commonNFTTokens } from './common-score/nftWithCommonOwnersQuery';
import { tokenSentQuery } from './common-score/tokens';
import { TokenQueryResponse } from '../OnChainGraph/types/tokenSentReceived';
import { mutualFollower } from './common-score/followings';
import { Following, SocialQueryResponse } from '../OnChainGraph/types/social';

// function useCommonSocials() {
//   // const [following, setFollowing] = useState<[boolean, boolean]>([false, false]);

//   const
// }

async function fetchNfts(
  address: string[],
  onCountChange?: (count: number) => void
) {
  let count = 0;

  const request = fetchQueryWithPagination(commonNFTTokens, {
    identity: address[0],
    identity2: address[1]
  });

  await paginateRequest(request, async data => {
    const { ethereum, polygon } = data;
    let ethTokens = ethereum?.TokenBalance || [];
    let maticTokens = polygon?.TokenBalance || [];
    if (ethTokens.length > 0 && ethTokens[0]?.token?.tokenBalances) {
      ethTokens = ethTokens.filter((token: CommonTokenType) =>
        Boolean(token?.token?.tokenBalances?.length)
      );
    }
    if (maticTokens.length > 0 && maticTokens[0]?.token?.tokenBalances) {
      maticTokens = maticTokens.filter((token: CommonTokenType) =>
        Boolean(token?.token?.tokenBalances?.length)
      );
    }

    const tokens = [...ethTokens, ...maticTokens];
    count += tokens.length;
    onCountChange?.(count);
    return true;
  });
  return count;
}

async function fetchPoaps(
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

async function fetchTokensTransfer(address: string[]) {
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

async function fetchMutualFollowings(address: string[]) {
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

export function ScoreOverview() {
  const [{ address }] = useSearchInput();
  const [nftCount, setNftCount] = useState(0);
  const [poapsCount, setPoapsCount] = useState(0);
  const [following, setFollowing] = useState<[boolean, boolean]>([
    false,
    false
  ]);
  const [followedBy, setFollowedBy] = useState<[boolean, boolean]>([
    false,
    false
  ]);
  const [tokenTransfer, setTokenTransfer] = useState<{
    tokenSent: boolean;
    tokenReceived: boolean;
  }>({
    tokenSent: false,
    tokenReceived: false
  });
  useEffect(() => {
    async function run() {
      await fetchPoaps(address, (count: number) => setPoapsCount(count));
      const { lens, farcaster } = await fetchMutualFollowings(address);
      setFollowing([lens.following, farcaster.following]);
      setFollowedBy([lens.followedBy, farcaster.followedBy]);
      await fetchNfts(address, (count: number) => setNftCount(count));
      const { tokenSent, tokenReceived } = await fetchTokensTransfer(address);
      setTokenTransfer({ tokenSent, tokenReceived });
    }
    run();
  }, [address]);

  // useGetSocialFollowings('');

  return (
    <div>
      <div>nft - {nftCount}</div>
      <div>poaps - {poapsCount}</div>
      <div>
        {following[1] ? `${address[0]} follows ${address[1]} in farcaster` : ''}
      </div>
      <div>
        {followedBy[0]
          ? `${address[0]} is followed by ${address[1]} in lens`
          : ''}
      </div>
      <div>
        {followedBy[1]
          ? `${address[0]} is followed by ${address[1]} in farcaster`
          : ''}
      </div>
      <div>
        {tokenTransfer.tokenSent
          ? `${address[0]} sent tokens to ${address[1]}`
          : ''}
      </div>
      <div>
        {tokenTransfer.tokenReceived
          ? `${address[0]} received tokens from ${address[1]}`
          : ''}
      </div>
    </div>
  );
}
