import { Poap, Token as TokenType } from '../../types';
import { Icon } from '../../../../Components/Icon';
import { useMemo, useCallback } from 'react';
import { getDAppType } from '../../utils';
import { ListWithMoreOptions } from '../../Tokens/ListWithMoreOptions';
import { useNavigate } from 'react-router-dom';
import { createTokenBalancesUrl } from '../../../../utils/createTokenUrl';
import { WalletAddress } from '../../Tokens/WalletAddress';

export function Token({
  token,
  onShowMore
}: {
  token: TokenType | Poap | null;
  onShowMore?: (value: string[], dataType: string) => void;
}) {
  const owner = token?.owner;
  const walletAddresses = owner?.addresses || '';
  const walletAddress = Array.isArray(walletAddresses)
    ? walletAddresses[0]
    : '';
  const primarEns = owner?.primaryDomain?.name || '';
  const ens = owner?.domains?.map(domain => domain.name) || [];
  const xmtpEnabled = owner?.xmtp?.find(({ isXMTPEnabled }) => isXMTPEnabled);
  const navigate = useNavigate();

  const { lens, farcaster } = useMemo(() => {
    const social = owner?.socials || [];
    const result = { lens: [], farcaster: [] };
    social.forEach(({ dappSlug, profileName }) => {
      const type = getDAppType(dappSlug);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const list = result[type];
      if (list) {
        list.push(profileName);
      }
    });
    return result;
  }, [owner?.socials]);

  const getShowMoreHandler = useCallback(
    (items: string[], type: string) => () => {
      onShowMore?.(items, type);
    },
    [onShowMore]
  );

  const handleAddressClick = useCallback(
    (address: string, type = '') => {
      const isFarcaster = type?.includes('farcaster');
      navigate(
        createTokenBalancesUrl({
          address: isFarcaster ? `fc_fname:${address}` : address,
          blockchain: 'ethereum',
          inputType: 'ADDRESS'
        })
      );
    },
    [navigate]
  );

  return (
    <>
      <td>
        <div className="max-w-[30vw] sm:max-w-none">
          <ListWithMoreOptions
            list={ens}
            onShowMore={getShowMoreHandler(ens, 'ens')}
            listFor="ens"
            onItemClick={handleAddressClick}
          />
        </div>
      </td>
      <td className="ellipsis">
        <ListWithMoreOptions
          list={[primarEns || '']}
          onShowMore={getShowMoreHandler(ens, 'ens')}
          listFor="ens"
          onItemClick={handleAddressClick}
        />
      </td>
      <td className="ellipsis">
        <WalletAddress address={walletAddress} onClick={handleAddressClick} />
      </td>
      <td>
        <ListWithMoreOptions
          list={lens}
          onShowMore={getShowMoreHandler(lens, 'lens')}
          listFor="lens"
          onItemClick={handleAddressClick}
        />
      </td>
      <td>
        <ListWithMoreOptions
          list={farcaster}
          onShowMore={getShowMoreHandler(farcaster, 'farcaster')}
          listFor="farcaster"
          onItemClick={handleAddressClick}
        />
      </td>
      <td>
        {xmtpEnabled ? <Icon name="xmtp" height={14} width={14} /> : '--'}
      </td>
    </>
  );
}
