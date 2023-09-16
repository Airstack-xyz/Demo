import { Asset } from '../../../Components/Asset';
import { Icon } from '../../../Components/Icon';
import { ListWithMoreOptions } from '../../../Components/ListWithMoreOptions';
import { WalletAddress } from '../../../Components/WalletAddress';
import { Follow } from './types';

export function TableRowLoader() {
  return (
    <div className="skeleton-loader px-9 py-5">
      <div data-loader-type="block" className="min-h-[54px]" />
    </div>
  );
}

const PLACEHOLDER_IMAGE = 'images/placeholder.svg';

export function TableRow({
  item,
  isLensDapp,
  onShowMoreClick,
  onAddressClick
}: {
  item: Follow;
  isLensDapp?: boolean;
  onShowMoreClick: (values: string[], dataType?: string) => void;
  onAddressClick: (address: string, dataType?: string) => void;
}) {
  const _wallet = item.followerAddress || item.followingAddress;

  const _tokenId = item.followerProfileId || item.followingProfileId;

  const getShowMoreHandler = (values: string[], type: string) => () =>
    onShowMoreClick(values, type);

  const _social = _wallet?.socials?.find(
    val => val.profileTokenId === _tokenId
  );

  const _lensAddresses =
    _wallet?.socials
      ?.filter(val => val.dappName === 'lens')
      .map(val => val.profileName) || [];
  const _farcasterAddresses =
    _wallet?.socials
      ?.filter(val => val.dappName === 'farcaster')
      .map(val => val.profileName) || [];

  const _primaryEns = _wallet?.primaryDomain?.name || '';

  const _ens = _wallet?.domains?.map(val => val.name) || [];

  const _walletAddress = _wallet?.identity
    ? _wallet.identity
    : Array.isArray(_wallet?.addresses)
    ? _wallet?.addresses[0]
    : '';

  const _xmtpEnabled = _wallet?.xmtp?.find(val => val.isXMTPEnabled);

  const lensCell = (
    <ListWithMoreOptions
      list={_lensAddresses}
      listFor="lens"
      onShowMore={getShowMoreHandler(_lensAddresses, 'lens')}
      onItemClick={onAddressClick}
    />
  );

  const farcasterCell = (
    <ListWithMoreOptions
      list={_farcasterAddresses}
      listFor="farcaster"
      onShowMore={getShowMoreHandler(_farcasterAddresses, 'farcaster')}
      onItemClick={onAddressClick}
    />
  );

  return (
    <tr className="[&>td]:px-2 [&>td]:py-5 [&>td]:align-middle min-h-[54px]">
      <td className="!pl-9">
        {_social && _social.dappName === 'lens' ? (
          <Asset
            preset="small"
            containerClassName="w-[50px] h-[50px] rounded"
            chain={_social?.blockchain}
            tokenId={_social?.profileTokenId}
            address={_social?.profileTokenAddress}
          />
        ) : (
          <img className="w-[50px] h-[50px] rounded" src={PLACEHOLDER_IMAGE} />
        )}
      </td>
      <td className="ellipsis">{isLensDapp ? lensCell : farcasterCell}</td>
      <td>#{_tokenId}</td>
      <td className="ellipsis">
        <ListWithMoreOptions
          list={[_primaryEns]}
          listFor="ens"
          onShowMore={getShowMoreHandler([_primaryEns], 'ens')}
          onItemClick={onAddressClick}
        />
      </td>
      <td className="ellipsis">
        <ListWithMoreOptions
          list={_ens}
          listFor="ens"
          onShowMore={getShowMoreHandler(_ens, 'ens')}
          onItemClick={onAddressClick}
        />
      </td>
      <td>
        <WalletAddress
          address={_walletAddress}
          dataType={item.dappName}
          onClick={onAddressClick}
        />
      </td>
      <td className="ellipsis">{isLensDapp ? farcasterCell : lensCell}</td>
      <td className="!pr-9">
        {_xmtpEnabled ? <Icon name="xmtp" height={14} width={14} /> : '--'}
      </td>
    </tr>
  );
}
