import { Asset } from '../../../Components/Asset';
import { Icon } from '../../../Components/Icon';
import LazyImage from '../../../Components/LazyImage';
import { ListWithMoreOptions } from '../../../Components/ListWithMoreOptions';
import { WalletAddress } from '../../../Components/WalletAddress';
import { Follow } from './types';

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
  onAddressClick
}: {
  item: Follow;
  isFollowerQuery: boolean;
  isLensDapp: boolean;
  onShowMoreClick: (values: string[], dataType?: string) => void;
  onAddressClick: (address: string, dataType?: string) => void;
}) {
  const wallet = isFollowerQuery ? item.followerAddress : item.followingAddress;

  const holding = wallet?.holdings?.[0];
  const isPoap = Boolean(holding?.poapEvent);

  const profileTokenId = isFollowerQuery
    ? item.followerProfileId
    : item.followingProfileId;

  const primaryEns = wallet?.primaryDomain?.name || '';

  const getShowMoreHandler = (type: string) => () =>
    onShowMoreClick([primaryEns], type);

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

  const tokenImage =
    holding?.token?.logo?.small ||
    holding?.tokenNfts?.contentValue?.image?.extraSmall ||
    holding?.token?.projectDetails?.imageUrl ||
    holding?.poapEvent?.contentValue?.image?.extraSmall;

  const tokenId = holding?.tokenId;
  const tokenAddress = holding?.tokenAddress;
  const tokenBlockchain = holding?.blockchain;

  const tokenOrEventId = isPoap ? holding?.poapEvent?.eventId : tokenId;

  const lensCell = (
    <ListWithMoreOptions
      list={lensAddresses}
      listFor="lens"
      onShowMore={getShowMoreHandler('lens')}
      onItemClick={onAddressClick}
    />
  );

  const farcasterCell = (
    <ListWithMoreOptions
      list={farcasterAddresses}
      listFor="farcaster"
      onShowMore={getShowMoreHandler('farcaster')}
      onItemClick={onAddressClick}
    />
  );

  return (
    <tr>
      <td className="flex gap-2">
        <div className="flex flex-col shrink-0 items-center">
          {isLensDapp && social ? (
            <>
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
            </>
          ) : (
            <LazyImage
              className="h-[50px] w-[50px] object-cover rounded"
              src={social?.profileImage}
            />
          )}
        </div>
        {!!(tokenImage || tokenAddress) && (
          <div className="flex flex-col shrink-0 items-center">
            <Asset
              preset="extraSmall"
              containerClassName="h-[50px] w-[50px]"
              imgProps={{ className: 'max-w-[50px] max-h-[50px]' }}
              image={tokenImage}
              chain={tokenBlockchain}
              tokenId={tokenId}
              address={tokenAddress}
              useImageOnError={isPoap}
            />
            <div className="mt-2">
              {tokenOrEventId ? `#${tokenOrEventId}` : '--'}
            </div>
          </div>
        )}
      </td>
      <td>{isLensDapp ? lensCell : farcasterCell}</td>
      <td>
        <ListWithMoreOptions
          list={[primaryEns]}
          listFor="ens"
          onShowMore={getShowMoreHandler('ens')}
          onItemClick={onAddressClick}
        />
      </td>
      <td>
        <ListWithMoreOptions
          list={ens}
          listFor="ens"
          onShowMore={getShowMoreHandler('ens')}
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
