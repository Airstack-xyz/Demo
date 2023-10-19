import {
  OnChainDataResponse,
  RecommendedUser,
  TokenTransfer,
  TokenTransferResponse
} from './types';

export function formatTokenTransfer(
  data: TokenTransferResponse,
  _recommendedUsers: RecommendedUser[] = []
) {
  const recommendedUsers: RecommendedUser[] = [..._recommendedUsers];
  const {
    EthereumTokenReceived,
    EthereumTokenSent,
    PolygonTokenReceived,
    PolygonTokenSent
  } = data ?? {};

  function getData(tokens: TokenTransfer[], isSent: boolean) {
    for (const ethereumTransfers of tokens) {
      const { to, from } = ethereumTransfers ?? {};
      const transfer = isSent ? to : from;
      const { addresses = [] } = transfer || {};
      const existingUserIndex = recommendedUsers.findIndex(
        ({ addresses: recommendedUsersAddresses }) =>
          recommendedUsersAddresses?.some?.(address =>
            addresses?.includes?.(address)
          )
      );
      const _tokenTransfers: {
        sent?: boolean;
        received?: boolean;
      } = {};
      if (isSent) {
        _tokenTransfers['sent'] = true;
      } else {
        _tokenTransfers['received'] = true;
      }
      if (existingUserIndex !== -1) {
        const _addresses =
          recommendedUsers?.[existingUserIndex]?.addresses || [];
        recommendedUsers[existingUserIndex].addresses = [
          ..._addresses,
          ...addresses
        ]?.filter((address, index, array) => array.indexOf(address) === index);
        recommendedUsers[existingUserIndex].tokenTransfers = {
          ...(recommendedUsers?.[existingUserIndex]?.tokenTransfers ?? {}),
          ..._tokenTransfers
        };
      } else {
        recommendedUsers.push({
          ...transfer,
          tokenTransfers: {
            ..._tokenTransfers
          }
        });
      }
    }
  }

  getData(EthereumTokenReceived?.TokenTransfer ?? [], false);
  getData(EthereumTokenSent?.TokenTransfer ?? [], true);
  getData(PolygonTokenReceived?.TokenTransfer ?? [], false);
  getData(PolygonTokenSent?.TokenTransfer ?? [], true);

  return recommendedUsers;
}

export function formatOnChainData(
  data: OnChainDataResponse,
  _recommendedUsers: RecommendedUser[] = []
) {
  const recommendedUsers: RecommendedUser[] = [..._recommendedUsers];
  const {
    LensFollowings,
    FarcasterFollowings,
    Poaps,
    EthereumNFTs,
    PolygonNFTs
  } = data ?? {};
  // Compile Lens following and follow back data
  for (const lensFollows of LensFollowings?.Following ?? []) {
    const existingUserIndex = recommendedUsers.findIndex(
      ({ addresses: recommendedUsersAddresses }) =>
        recommendedUsersAddresses?.some?.(address =>
          lensFollows.followingAddress.addresses?.includes?.(address)
        )
    );

    const { followingAddress } = lensFollows;

    const followsBack = Boolean(
      lensFollows?.followingAddress?.mutualFollower?.Follower?.[0]
    );
    if (existingUserIndex !== -1) {
      recommendedUsers[existingUserIndex] = {
        ...followingAddress,
        ...recommendedUsers[existingUserIndex],
        follows: { followingOnLens: true, followedOnLens: followsBack }
      };
    } else {
      recommendedUsers.push({
        ...followingAddress,
        follows: { followingOnLens: true, followedOnLens: followsBack }
      });
    }
  }

  // Compile Farcaster following and follow back data
  for (const farcasterFollows of FarcasterFollowings?.Following ?? []) {
    const { followingAddress } = farcasterFollows;

    const followsBack = Boolean(
      farcasterFollows?.followingAddress?.mutualFollower?.Follower?.[0]
    );
    const { addresses = [] } = followingAddress ?? {};

    const existingUserIndex = recommendedUsers.findIndex(
      ({ addresses: recommendedUsersAddresses }) =>
        recommendedUsersAddresses?.some?.(address =>
          addresses?.includes?.(address)
        )
    );
    if (existingUserIndex !== -1) {
      const _addresses = recommendedUsers?.[existingUserIndex]?.addresses || [];
      recommendedUsers[existingUserIndex].addresses = [
        ..._addresses,
        ...addresses
      ]?.filter((address, index, array) => array.indexOf(address) === index);

      recommendedUsers[existingUserIndex].follows = {
        ...(recommendedUsers?.[existingUserIndex]?.follows ?? {}),
        followingOnFarcaster: true,
        followedOnFarcaster: followsBack
      };
    } else {
      recommendedUsers.push({
        ...followingAddress,
        follows: {
          followingOnFarcaster: true,
          followedOnFarcaster: followsBack
        }
      });
    }
  }

  return {
    data,
    recommendedUsers,
    poaps: [...(Poaps?.Poap?.map?.(({ eventId }) => eventId) ?? [])],
    nfts: {
      ethereum:
        EthereumNFTs?.TokenBalance?.map?.(({ tokenAddress }) => tokenAddress) ??
        [],
      polygon:
        PolygonNFTs?.TokenBalance?.map?.(({ tokenAddress }) => tokenAddress) ??
        []
    }
  };
}
