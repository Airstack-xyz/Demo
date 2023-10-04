import { ReactNode } from 'react';
import { Asset } from '../../../Components/Asset';
import { Icon } from '../../../Components/Icon';
import LazyImage from '../../../Components/LazyImage';
import { ListWithMoreOptions } from '../../../Components/ListWithMoreOptions';
import { WalletAddress } from '../../../Components/WalletAddress';
import { Follow } from './types';
import { formatNumber } from '../../../utils/formatNumber';

export function TableRowLoader() {
  return (
    <div className="skeleton-loader px-9 py-3">
      <div data-loader-type="block" className="h-[50px]" />
    </div>
  );
}

export function TableRow({
  item,
  isLensDapp,
  isFollowerQuery,
  onShowMoreClick,
  onAddressClick,
  onAssetClick
}: {
  item: Follow;
  isFollowerQuery: boolean;
  isLensDapp: boolean;
  onShowMoreClick: (
    addresses: string[],
    dataType?: string,
    identity?: string
  ) => void;
  onAddressClick: (address: string, dataType?: string) => void;
  onAssetClick: (
    tokenAddress: string,
    tokenId: string,
    blockchain: string,
    eventId?: string
  ) => void;
}) {
  const wallet = isFollowerQuery ? item.followerAddress : item.followingAddress;

  const profileTokenId = isFollowerQuery
    ? item.followerProfileId
    : item.followingProfileId;

  const primaryEns = wallet?.primaryDomain?.name || '';

  const social = wallet?.socials?.find(
    v => v.profileTokenId === profileTokenId
  );

  const lensAddresses =
    wallet?.socials
      ?.filter(v => v.dappName === 'lens')
      .map(v => v.profileName) || [];
  const farcasterAddresses =
    wallet?.socials
      ?.filter(v => v.dappName === 'farcaster')
      .map(v => v.profileName) || [];

  const ens = wallet?.domains?.map(v => v.name) || [];

  const walletAddress = Array.isArray(wallet?.addresses)
    ? wallet?.addresses[0]
    : '';

  const xmtpEnabled = wallet?.xmtp?.find(v => v.isXMTPEnabled);

  const userId = social?.userId;

  const lensCell = (
    <ListWithMoreOptions
      list={lensAddresses}
      listFor="lens"
      onShowMore={() => onShowMoreClick([primaryEns], 'lens')}
      onItemClick={onAddressClick}
    />
  );

  const farcasterCell = (
    <ListWithMoreOptions
      list={farcasterAddresses}
      listFor="farcaster"
      onShowMore={() => onShowMoreClick([primaryEns], 'farcaster')}
      onItemClick={onAddressClick}
    />
  );

  const renderAssets = () => {
    const assets: ReactNode[] = [];
    if (isLensDapp && social) {
      assets.push(
        <div
          key="profile-token"
          className="cursor-pointer"
          onClick={() =>
            onAssetClick(
              social.profileTokenAddress,
              social.profileTokenId,
              social.blockchain
            )
          }
        >
          <Asset
            preset="extraSmall"
            containerClassName="h-[50px] w-[50px]"
            imgProps={{
              className: 'max-w-[50px] max-h-[50px]'
            }}
            chain={social.blockchain}
            tokenId={social.profileTokenId}
            address={social.profileTokenAddress}
          />
          <div className="mt-2">
            {profileTokenId ? `#${profileTokenId}` : '--'}
          </div>
        </div>
      );
    } else {
      assets.push(
        <div key="profile-image">
          <LazyImage
            className="h-[50px] w-[50px] object-cover rounded"
            src={social?.profileImage}
          />
        </div>
      );
    }

    const holding =
      wallet?.poapHoldings?.[0] ||
      wallet?.ethereumHoldings?.[0] ||
      wallet?.polygonHoldings?.[0];

    if (holding) {
      const holdingEventId = holding?.poapEvent?.eventId;
      const isPoap = Boolean(holdingEventId);

      const holdingImage =
        holding?.token?.logo?.small ||
        holding?.tokenNfts?.contentValue?.image?.extraSmall ||
        holding?.token?.projectDetails?.imageUrl ||
        holding?.poapEvent?.contentValue?.image?.extraSmall;

      const holdingTokenId = holding?.tokenId;
      const holdingTokenAddress = holding?.tokenAddress;
      const holdingBlockchain = holding?.blockchain;
      const holdingFormattedAmount = holding?.formattedAmount;
      const holdingType = holding?.tokenType;

      let holdingText = null;

      if (isPoap) {
        holdingText = `#${holdingEventId}`;
      } else if (holdingType === 'ERC20' && holdingFormattedAmount) {
        holdingText = formatNumber(holdingFormattedAmount);
      } else if (holdingTokenId) {
        holdingText = `#${holdingTokenId}`;
      }

      assets.push(
        <div
          key="holding-token"
          className="cursor-pointer"
          onClick={() =>
            onAssetClick(
              holdingTokenAddress,
              holdingTokenId,
              holdingBlockchain,
              holdingEventId
            )
          }
        >
          <Asset
            preset="extraSmall"
            containerClassName="h-[50px] w-[50px]"
            imgProps={{ className: 'max-w-[50px] max-h-[50px]' }}
            image={holdingImage}
            chain={holdingBlockchain}
            tokenId={holdingTokenId}
            address={holdingTokenAddress}
            useImageOnError={isPoap}
          />
          <div className="mt-2">{holdingText || '--'}</div>
        </div>
      );
    }

    return assets;
  };

  return (
    <tr>
      <td className="flex gap-2 [&>div]:flex [&>div]:flex-col [&>div]:items-center [&>div]:shrink-0">
        {renderAssets()}
      </td>
      <td>{isLensDapp ? lensCell : farcasterCell}</td>
      {!isLensDapp && <td>{userId ? `#${userId}` : '--'}</td>}
      <td>
        <ListWithMoreOptions
          list={[primaryEns]}
          listFor="ens"
          onItemClick={onAddressClick}
        />
      </td>
      <td>
        <ListWithMoreOptions
          list={ens}
          listFor="ens"
          onShowMore={() =>
            onShowMoreClick(wallet?.addresses, 'ens', primaryEns)
          }
          onItemClick={onAddressClick}
        />
      </td>
      <td>
        <WalletAddress address={walletAddress} onClick={onAddressClick} />
      </td>
      <td>{isLensDapp ? farcasterCell : lensCell}</td>
      <td>
        {xmtpEnabled ? <Icon name="xmtp" height={14} width={14} /> : '--'}
      </td>
    </tr>
  );
}
