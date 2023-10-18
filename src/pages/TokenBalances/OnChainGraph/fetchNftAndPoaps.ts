import { fetchQueryWithPagination } from '@airstack/airstack-react';
import { getPoapsAndNft } from '../../../queries/onChainGraphQuery';
import { NFTAndPoapResponse, RecommendedUser } from './types';

function formatData(data: NFTAndPoapResponse) {
  const recommendedUsers: RecommendedUser[] = [];
  const { EthereumNFTs, PolygonNFTs, Poaps } = data ?? {};

  // Compile Ethereum NFTs Data
  for (const ethereumNFT of EthereumNFTs?.TokenBalance ?? []) {
    const { owner, token } = ethereumNFT ?? {};
    const { name, logo } = token ?? {};
    const { addresses, xmtp } = owner ?? {};
    if (
      !!xmtp?.length &&
      name?.length > 0 &&
      !name?.includes('-Follower') &&
      !name?.includes('$') &&
      !name?.includes('Lens Protocol Profiles') &&
      !name?.includes('-Collect')
    ) {
      const existingUserIndex = recommendedUsers.findIndex(
        ({ addresses: recommendedUsersAddresses }) =>
          recommendedUsersAddresses?.some?.(address =>
            addresses?.includes?.(address)
          )
      );
      if (existingUserIndex !== -1) {
        const _addresses =
          recommendedUsers?.[existingUserIndex]?.addresses || [];
        recommendedUsers[existingUserIndex].addresses = [
          ..._addresses,
          ...addresses
        ]?.filter((address, index, array) => array.indexOf(address) === index);
        const _nfts = recommendedUsers?.[existingUserIndex]?.nfts || [];
        recommendedUsers[existingUserIndex].nfts = [
          ..._nfts,
          { name, image: logo?.small }
        ];
      } else {
        recommendedUsers.push({
          ...owner,
          nfts: [{ name, image: logo?.small }]
        });
      }
    }
  }

  // Compile Polygon NFTs Data
  for (const polygonNFT of PolygonNFTs?.TokenBalance ?? []) {
    const { owner, token } = polygonNFT ?? {};
    const { name, logo } = token ?? {};
    const { addresses, xmtp } = owner ?? {};
    if (
      !!xmtp?.length &&
      name?.length > 0 &&
      !name?.includes('-Follower') &&
      !name?.includes('$') &&
      !name?.includes('Lens Protocol Profiles') &&
      !name?.includes('-Collect')
    ) {
      const existingUserIndex = recommendedUsers.findIndex(
        ({ addresses: recommendedUsersAddresses }) =>
          recommendedUsersAddresses?.some?.(address =>
            addresses?.includes?.(address)
          )
      );
      if (existingUserIndex !== -1) {
        const _addresses =
          recommendedUsers?.[existingUserIndex]?.addresses || [];
        recommendedUsers[existingUserIndex].addresses = [
          ..._addresses,
          ...addresses
        ]?.filter((address, index, array) => array.indexOf(address) === index);
        const _nfts = recommendedUsers?.[existingUserIndex]?.nfts || [];
        recommendedUsers[existingUserIndex].nfts = [
          ..._nfts,
          { name, image: logo?.small }
        ];
      } else {
        recommendedUsers.push({
          ...owner,
          nfts: [{ name, image: logo?.small }]
        });
      }
    }
  }

  // Compile POAPs Data
  for (const poap of Poaps?.Poap ?? []) {
    const { attendee, poapEvent } = poap ?? {};
    const { eventName: name, contentValue } = poapEvent ?? {};
    const { addresses, xmtp } = attendee?.owner ?? {};
    if (xmtp?.length) {
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
        recommendedUsers[existingUserIndex].poaps = [
          ..._poaps,
          { name, image: contentValue?.image?.extraSmall }
        ];
      } else {
        recommendedUsers.push({
          ...(attendee?.owner ?? {}),
          poaps: [{ name, image: contentValue?.image?.extraSmall }]
        });
      }
    }
  }

  return recommendedUsers;
}

export const fetchNftAndTokens = async (
  {
    poaps,
    nfts
  }: {
    poaps: string[];
    nfts: {
      ethereum: string[];
      polygon: string[];
    };
  },
  config = {
    nfts: true,
    poaps: true,
    tokenTransfers: true,
    socialFollows: true
  },
  cb: (data: ReturnType<typeof formatData>) => void
) => {
  // TODO: remove this later
  let attemptNo = 0;
  const { ethereum: ethereumNFTs, polygon: polygonNFTs } = nfts;
  // STEP 1.2: Fetch NFT and POAP holders using input from Step 1.1
  if (config?.nfts || config?.poaps) {
    const { data, error, hasNextPage, getNextPage } =
      await fetchQueryWithPagination<NFTAndPoapResponse>(
        getPoapsAndNft(config),
        {
          ethereumNFTs,
          polygonNFTs,
          poaps
        }
      );
    if (data) {
      cb(formatData(data));
    }
    if (error) {
      return;
    }

    let fetchNextPage = getNextPage;
    let shouldFetchNextPage = hasNextPage;

    while (shouldFetchNextPage && attemptNo < 10) {
      const res = await fetchNextPage();
      if (!res || res.error) {
        break;
      }
      if (res.data) {
        cb(formatData(res.data));
      }
      shouldFetchNextPage = res.hasNextPage;
      fetchNextPage = res.getNextPage;
      attemptNo++;
    }
  }
};
