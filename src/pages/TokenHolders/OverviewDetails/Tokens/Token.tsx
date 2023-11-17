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
  onShowMoreClick?: (addresses: string[], dataType?: string) => void;
  onAddressClick?: (addresses: string, type?: string) => void;
}) {
  const owner = token?.owner;
  const walletAddresses = owner?.addresses || [];
  const walletAddress = owner?.identity || walletAddresses[0] || '';
  const primaryEns = owner?.primaryDomain?.name || '';
  const ens = owner?.domains?.map(domain => domain.name) || [];
  const xmtpEnabled = owner?.xmtp?.find(({ isXMTPEnabled }) => isXMTPEnabled);

  const lensSocials =
    owner?.socials?.filter(item => item.dappName === 'lens') || [];
  const lensAddresses = lensSocials.map(item => item.profileName);
  const lensHandles = lensSocials.map(item => item.profileHandle);
  const farcasterAddresses =
    owner?.socials
      ?.filter(item => item.profileName && item.dappName === 'farcaster')
      .map(item => item.profileName) || [];

  const getShowMoreHandler = (addresses: string[], type: string) => () =>
    onShowMoreClick?.([...addresses, ...walletAddresses], type);

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
          list={lensHandles}
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
