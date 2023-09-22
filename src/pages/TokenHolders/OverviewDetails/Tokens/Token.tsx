import { Icon } from '../../../../Components/Icon';
import { ListWithMoreOptions } from '../../../../Components/ListWithMoreOptions';
import { WalletAddress } from '../../../../Components/WalletAddress';
import { Poap, Token as TokenType } from '../../types';

export function Token({
  token,
  onShowMoreClick,
  onAddressClick
}: {
  token: TokenType | Poap | null;
  onShowMoreClick?: (values: string[], dataType?: string) => void;
  onAddressClick?: (address: string, type?: string) => void;
}) {
  const owner = token?.owner;
  const walletAddresses = owner?.addresses || '';
  const walletAddress = owner?.identity
    ? owner.identity
    : Array.isArray(walletAddresses)
    ? walletAddresses[0]
    : '';
  const primaryEns = owner?.primaryDomain?.name || '';
  const ens = owner?.domains?.map(domain => domain.name) || [];
  const xmtpEnabled = owner?.xmtp?.find(({ isXMTPEnabled }) => isXMTPEnabled);

  const lensAddresses =
    owner?.socials
      ?.filter(item => item.dappName === 'lens')
      .map(item => item.profileName) || [];
  const farcasterAddresses =
    owner?.socials
      ?.filter(item => item.dappName === 'farcaster')
      .map(item => item.profileName) || [];

  const getShowMoreHandler = (items: string[], type: string) => () =>
    onShowMoreClick?.(items, type);

  return (
    <>
      <td>
        <div className="max-w-[30vw] sm:max-w-none">
          <ListWithMoreOptions
            list={ens}
            listFor="ens"
            onShowMore={getShowMoreHandler(ens, 'ens')}
            onItemClick={onAddressClick}
          />
        </div>
      </td>
      <td className="ellipsis">
        <ListWithMoreOptions
          list={[primaryEns || '']}
          listFor="ens"
          onShowMore={getShowMoreHandler(ens, 'ens')}
          onItemClick={onAddressClick}
        />
      </td>
      <td className="ellipsis">
        <WalletAddress address={walletAddress} onClick={onAddressClick} />
      </td>
      <td>
        <ListWithMoreOptions
          list={lensAddresses}
          listFor="lens"
          onShowMore={getShowMoreHandler(lensAddresses, 'lens')}
          onItemClick={onAddressClick}
        />
      </td>
      <td>
        <ListWithMoreOptions
          list={farcasterAddresses}
          listFor="farcaster"
          onShowMore={getShowMoreHandler(farcasterAddresses, 'farcaster')}
          onItemClick={onAddressClick}
        />
      </td>
      <td>
        {xmtpEnabled ? <Icon name="xmtp" height={14} width={14} /> : '--'}
      </td>
    </>
  );
}
