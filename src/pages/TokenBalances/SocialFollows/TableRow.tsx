import { Asset, Image } from '../../../Components/Asset';
import { Icon } from '../../../Components/Icon';
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

  const tokenId = isFollowerQuery
    ? item.followerProfileId
    : item.followingProfileId;

  const getShowMoreHandler = (values: string[], type: string) => () =>
    onShowMoreClick(values, type);

  const social = wallet?.socials?.find(val => val.profileTokenId === tokenId);

  const lensAddresses =
    wallet?.socials
      ?.filter(val => val.dappName === 'lens')
      .map(val => val.profileName) || [];
  const farcasterAddresses =
    wallet?.socials
      ?.filter(val => val.dappName === 'farcaster')
      .map(val => val.profileName) || [];

  const primaryEns = wallet?.primaryDomain?.name || '';

  const ens = wallet?.domains?.map(val => val.name) || [];

  const walletAddress = wallet?.identity
    ? wallet.identity
    : Array.isArray(wallet?.addresses)
    ? wallet?.addresses[0]
    : '';

  const xmtpEnabled = wallet?.xmtp?.find(val => val.isXMTPEnabled);

  const lensCell = (
    <ListWithMoreOptions
      list={lensAddresses}
      listFor="lens"
      onShowMore={getShowMoreHandler(lensAddresses, 'lens')}
      onItemClick={onAddressClick}
    />
  );

  const farcasterCell = (
    <ListWithMoreOptions
      list={farcasterAddresses}
      listFor="farcaster"
      onShowMore={getShowMoreHandler(farcasterAddresses, 'farcaster')}
      onItemClick={onAddressClick}
    />
  );

  return (
    <tr>
      <td>
        {isLensDapp && social ? (
          <Asset
            preset="extraSmall"
            containerClassName="w-[50px] h-[50px] [&>img]:w-[50px] [&>img]:max-w-[50px]"
            chain={social.blockchain}
            tokenId={social.profileTokenId}
            address={social.profileTokenAddress}
          />
        ) : (
          <Image
            className="w-[50px] h-[50px] rounded"
            src={social?.profileImage}
          />
        )}
      </td>
      <td>{isLensDapp ? lensCell : farcasterCell}</td>
      <td>{isLensDapp ? `#${tokenId}` : `#${social?.userId}`}</td>
      <td>
        <ListWithMoreOptions
          list={[primaryEns]}
          listFor="ens"
          onShowMore={getShowMoreHandler([primaryEns], 'ens')}
          onItemClick={onAddressClick}
        />
      </td>
      <td>
        <ListWithMoreOptions
          list={ens}
          listFor="ens"
          onShowMore={getShowMoreHandler(ens, 'ens')}
          onItemClick={onAddressClick}
        />
      </td>
      <td>
        <WalletAddress
          address={walletAddress}
          dataType={item.dappName}
          onClick={onAddressClick}
        />
      </td>
      <td>{isLensDapp ? farcasterCell : lensCell}</td>
      <td>
        {xmtpEnabled ? <Icon name="xmtp" height={14} width={14} /> : '--'}
      </td>
    </tr>
  );
}
