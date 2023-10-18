import { useSearchInput } from '../../../hooks/useSearchInput';
import { useQueryWithPagination } from '@airstack/airstack-react';
import { getOnChainGraphQuery } from '../../../queries/onChainGraphQuery';
import { RecommendedUser, ResponseType } from './types';
import { useEffect, useState } from 'react';
import { fetchNftAndTokens } from './fetchNftAndPoaps';
import { UserInfo } from './UserInfo';
import classNames from 'classnames';
import { Header } from './Header';
import { Loader } from './Loader';

function formatData(data: ResponseType) {
  const recommendedUsers: RecommendedUser[] = [];
  const {
    LensMutualFollows,
    FarcasterMutualFollows,
    EthereumTransfers,
    PolygonTransfers,
    Poaps,
    EthereumNFTs,
    PolygonNFTs
  } = data ?? {};
  // Compile Lens Mutual Follows Data
  for (const lensFollows of LensMutualFollows?.Follower ?? []) {
    const { followingAddress } =
      lensFollows?.followerAddress?.socialFollowings?.Following?.[0] ?? {};
    const { xmtp } = followingAddress ?? {};
    if (xmtp?.length > 0) {
      recommendedUsers.push({
        ...followingAddress,
        follows: { lens: true }
      });
    }
  }

  // Compile Farcaster Mutual Follows Data
  for (const farcasterFollows of FarcasterMutualFollows?.Follower ?? []) {
    const { followingAddress } =
      farcasterFollows?.followerAddress?.socialFollowings?.Following?.[0] ?? {};
    const { addresses = [], xmtp } = followingAddress ?? {};

    if (xmtp?.length) {
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
        recommendedUsers[existingUserIndex].follows = {
          ...(recommendedUsers?.[existingUserIndex]?.follows ?? {}),
          farcaster: true
        };
      } else {
        recommendedUsers.push({
          ...followingAddress,
          follows: { farcaster: true }
        });
      }
    }
  }

  // Compile Ethereum Token Transfers Data
  for (const ethereumTransfers of EthereumTransfers?.TokenTransfer ?? []) {
    const { to } = ethereumTransfers ?? {};
    const { addresses, xmtp = [] } = to ?? {};
    if (xmtp?.length > 0) {
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
        recommendedUsers[existingUserIndex].tokenTransfers = true;
      } else {
        recommendedUsers.push({ ...to, tokenTransfers: true });
      }
    }
  }

  // Compile Polygon Token Transfers Data
  for (const polygonTransfers of PolygonTransfers?.TokenTransfer ?? []) {
    const { to } = polygonTransfers ?? {};
    const { addresses = [], xmtp = [] } = to ?? {};
    if (xmtp?.length > 0) {
      const existingUserIndex = recommendedUsers.findIndex(
        ({ addresses: recommendedUsersAddresses }) =>
          recommendedUsersAddresses?.some?.(address =>
            addresses?.includes?.(address)
          )
      );
      if (existingUserIndex !== -1) {
        const _address = recommendedUsers?.[existingUserIndex]?.addresses || [];
        recommendedUsers[existingUserIndex].addresses = [
          ..._address,
          ...addresses
        ]?.filter((address, index, array) => array.indexOf(address) === index);
        recommendedUsers[existingUserIndex].tokenTransfers = true;
      } else {
        recommendedUsers.push({ ...to, tokenTransfers: true });
      }
    }
  }

  return {
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

const onChainQueryLimit = 200 * 7;
const nftAndPoapsLimit = 200 * 3;
export function OnChainGraph() {
  const [scanningCount, setScanningCount] = useState<number>(onChainQueryLimit);
  const [showGridView, setShowGridView] = useState(true);
  const [{ address: identities }] = useSearchInput();
  const [recommendations, setRecommendations] = useState<RecommendedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(true);

  const { data, pagination } = useQueryWithPagination(
    getOnChainGraphQuery({}),
    {
      user: identities[0]
    },
    {
      dataFormatter: formatData,
      onCompleted(data) {
        setRecommendations(data?.recommendedUsers ?? []);
      }
    }
  );

  const { poaps, nfts } = data ?? {};
  const { hasNextPage, getNextPage } = pagination;

  useEffect(() => {
    if (!poaps || !nfts) return;
    setLoading(true);

    setScanningCount(scanningCount => scanningCount + nftAndPoapsLimit);
    fetchNftAndTokens({ poaps, nfts }, undefined, (data: RecommendedUser[]) => {
      // console.log(' data received ', data);
      setRecommendations(recommendations => {
        for (const res of data) {
          const { addresses = [], xmtp, nfts = [], poaps = [] } = res ?? {};
          if (xmtp?.length) {
            const existingUserIndex = recommendations.findIndex(
              ({ addresses: recommendedUsersAddresses }) =>
                recommendedUsersAddresses?.some?.(address =>
                  addresses?.includes?.(address)
                )
            );
            if (existingUserIndex !== -1) {
              const _addresses =
                recommendations?.[existingUserIndex]?.addresses || [];
              recommendations[existingUserIndex].addresses = [
                ..._addresses,
                ...addresses
              ]?.filter(
                (address, index, array) => array.indexOf(address) === index
              );
              const _nfts = recommendations?.[existingUserIndex]?.nfts ?? [];
              recommendations[existingUserIndex].nfts = [..._nfts, ...nfts];
              recommendations[existingUserIndex].poaps = [
                ...(recommendations?.[existingUserIndex]?.poaps ?? []),
                ...poaps
              ];
            } else {
              recommendations.push(res);
            }
          }
        }
        return [...recommendations];
      });
    }).then(() => {
      if (hasNextPage) {
        getNextPage();
      } else {
        setScanning(false);
      }
    });
  }, [getNextPage, hasNextPage, identities, nfts, poaps]);

  return (
    <div className="max-w-[950px] mx-auto w-full text-sm pt-10 sm:pt-5">
      <Header
        identities={identities}
        showGridView={showGridView}
        setShowGridView={setShowGridView}
      />
      <div
        className={classNames('grid grid-cols-3 gap-12 my-10', {
          '!grid-cols-1 [&>div]:w-[600px] [&>div]:max-w-[100%] justify-items-center':
            !showGridView
        })}
      >
        {recommendations?.map?.((user, index) => (
          <UserInfo
            user={user}
            key={index}
            identity={identities[0]}
            showDetails={!showGridView}
          />
        ))}
      </div>
      {loading && (
        <Loader
          total={scanningCount}
          matching={recommendations.length}
          scanCompleted={!scanning}
          onSortByScore={() => {
            setLoading(false);
          }}
        />
      )}
    </div>
  );
}
