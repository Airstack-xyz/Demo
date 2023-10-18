import { Icon, IconType } from '../../../Components/Icon';
import { useSearchInput } from '../../../hooks/useSearchInput';
import { useQueryWithPagination } from '@airstack/airstack-react';
import { getOnChainGraphQuery } from '../../../queries/onChainGraphQuery';
import { RecommendedUser, ResponseType } from './types';
import { useEffect, useState } from 'react';
import { CopyButton } from '../../../Components/CopyButton';
import { Asset } from '../../../Components/Asset';
import { Chain } from '@airstack/airstack-react/constants';
import { fetchNftAndTokens } from './fetchNftAndPoaps';

function formatter(data: ResponseType) {
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

function TextWithIcon({
  icon,
  text,
  height = 20,
  width = 20
}: {
  icon: IconType;
  text: string;
  height?: number;
  width?: number;
}) {
  return (
    <div className="flex items-center">
      <span className="w-[20px] flex items-center justify-center">
        <Icon
          name={icon}
          height={height}
          width={width}
          className="mr-2 rounded-full"
        />
      </span>
      <span className="text-text-secondary">{text}</span>
    </div>
  );
}

function Item({ user, identity }: { user: RecommendedUser; identity: string }) {
  const { tokenTransfers, follows, poaps, nfts } = user;

  const commonNftCount = nfts?.length || 0;

  let social = user.socials?.find(social => social.profileImage);
  if (!social) {
    social = user.socials?.find(social => social.dappName === 'lens');
  }

  const blockchain =
    social?.blockchain !== 'ethereum' && social?.blockchain !== 'polygon'
      ? ''
      : social?.blockchain;

  return (
    <div className="border-solid-stroke bg-glass rounded-18 overflow-hidden h-[326px]">
      <div className="flex p-5 bg-glass overflow-hidden">
        <div className="h-[78px] min-w-[78px] w-[78px] mr-4 relative flex justify-center">
          <span className="w-full h-full border-solid-stroke overflow-hidden rounded-full">
            <Asset
              preset="medium"
              containerClassName="w-full h-full flex items-center justify-center"
              chain={blockchain as Chain}
              tokenId={blockchain ? social?.profileTokenId || '' : ''}
              address={social?.profileTokenAddress || ''}
              image={social?.profileImage}
              useImageOnError
              className="[&>img]:!w-full"
            />
          </span>
          <span className="absolute -bottom-2 text-xs bg-stroke-highlight-blue px-1 py-0.5 rounded-md">
            45
          </span>
        </div>
        <div className="flex-1">
          <div className="font-semibold text-base">
            {user?.domains?.[0]?.name || 'N/A'}
          </div>
          <div className="mb-2 mt-1 text-text-secondary text-xs flex items-center w-full ">
            <span className="mr-1 flex-1 ellipsis max-w-[100px]">
              {user?.addresses?.[0]}
            </span>
            <CopyButton value="" />
          </div>
          <div className="flex items-center [&>img]:mr-3">
            {user.xmtp && <Icon name="xmtp-grey" />}
            {user.domains && <Icon name="ens-grey" />}
            {user.socials?.find(({ dappName }) => dappName === 'lens') && (
              <Icon name="lens-grey" />
            )}
            {user.socials?.find(({ dappName }) => dappName === 'farcaster') && (
              <Icon name="farcaster-grey" />
            )}
          </div>
        </div>
      </div>
      <div className="leading-loose p-5">
        {tokenTransfers && (
          <TextWithIcon icon="token-sent" text={`Sent ${identity} tokens`} />
        )}
        {commonNftCount > 0 && (
          <TextWithIcon
            icon="nft-common"
            text={`${commonNftCount} NFTs in common`}
          />
        )}
        {!!poaps?.length && (
          <TextWithIcon
            icon="poap-common"
            text={`${poaps?.length} POAPs in common`}
            width={16}
          />
        )}
        {follows?.farcaster && (
          <TextWithIcon
            icon="farcaster"
            text="Farcaster mutual follow"
            height={17}
            width={17}
          />
        )}
        {follows?.lens && (
          <TextWithIcon icon="lens" text="Lens mutual follow" />
        )}
      </div>
    </div>
  );
}

export function OnChainGraph() {
  const [{ address: identities }] = useSearchInput();

  const [recommendations, setRecommendations] = useState<RecommendedUser[]>([]);

  const { data } = useQueryWithPagination(
    getOnChainGraphQuery({}),
    {
      user: identities[0]
    },
    {
      dataFormatter: formatter,
      onCompleted(data) {
        setRecommendations(data?.recommendedUsers ?? []);
      }
    }
  );

  const { poaps, nfts } = data ?? {};

  useEffect(() => {
    if (!poaps || !nfts) return;
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
    });
  }, [identities, nfts, poaps]);

  const handleClose = () => {
    // setQueryData(
    //   {
    //     activeSocialInfo: ''
    //   },
    //   { updateQueryParams: true }
    // );
  };

  return (
    <div className="max-w-[950px] mx-auto w-full text-sm pt-10 sm:pt-0">
      <div className="flex items-center">
        <div className="flex items-center max-w-[60%] sm:w-auto overflow-hidden mr-2">
          <div
            className="flex items-center cursor-pointer hover:bg-glass-1 px-2 py-1 rounded-full overflow-hidden"
            onClick={handleClose}
          >
            <Icon
              name="token-holders"
              height={20}
              width={20}
              className="mr-2"
            />
            <span className="text-text-secondary break-all cursor-pointer ellipsis">
              Token balances of {identities.join(', ')}
            </span>
          </div>
          <span className="text-text-secondary">/</span>
        </div>
        <div className="flex items-center ellipsis">
          <Icon name="table-view" height={20} width={20} className="mr-2" />
          <span className="text-text-primary">OnChain Graph</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-12 my-10">
        {recommendations?.map?.((user, index) => (
          <Item user={user} key={index} identity={identities[0]} />
        ))}
      </div>
    </div>
  );
}
