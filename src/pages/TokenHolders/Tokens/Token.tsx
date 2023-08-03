import { Chain } from '@airstack/airstack-react/constants';
import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../../Components/Icon';
import { Asset } from '../../../Components/Asset';
import { getDAppType } from '../utils';
import { Poap, Token as TokenType } from '../types';
import { ListWithMoreOptions } from './ListWithMoreOptions';
import { createTokenBalancesUrl } from '../../../utils/createTokenUrl';
import { showToast } from '../../../utils/showToast';

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
  const tokenId = token?.tokenId || '';
  const tokenAddress = token?.tokenAddress || '';
  const primarEns = owner?.primaryDomain?.name || '';
  const ens = owner?.domains?.map(domain => domain.name) || [];
  const _token = token as TokenType;
  const image =
    _token?.token?.logo?.small || _token?.token?.projectDetails?.imageUrl;

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
    (address: string, type: string) => {
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
      <td className="!pl-9">
        <div className="token-img-wrapper w-[50px] h-[50px] rounded-md overflow-hidden [&>div]:w-full [&>div>img]:w-full [&>div>img]:min-w-full flex-col-center">
          <Asset
            address={tokenAddress}
            tokenId={tokenId}
            preset="small"
            containerClassName="token-img"
            chain={token?.blockchain as Chain}
            image={image}
          />
        </div>
      </td>
      <td className="ellipsis">
        <div
          className="flex px-1 py-1 rounded-18 hover:bg-glass cursor-pointer"
          onClick={() => {
            handleAddressClick(walletAddress, '');
          }}
        >
          <span className="ellipsis">{walletAddress || '--'}</span>
          {walletAddress && (
            <Icon
              name="copy"
              height={16}
              width={16}
              onClick={async e => {
                e.stopPropagation();
                await navigator.clipboard.writeText(walletAddress);
                showToast('Copied to clipboard');
              }}
            />
          )}
        </div>
      </td>
      <td className="ellipsis">
        {_token?.tokenType === 'ERC20'
          ? _token?.formattedAmount
          : tokenId
          ? `#${tokenId}`
          : '--'}
      </td>
      <td className="ellipsis">
        {}
        <ListWithMoreOptions
          list={[primarEns || '--']}
          onShowMore={getShowMoreHandler(ens, 'ens')}
          listFor="ens"
          onItemClick={handleAddressClick}
        />
      </td>
      <td>
        <ListWithMoreOptions
          list={ens}
          onShowMore={getShowMoreHandler(ens, 'ens')}
          listFor="ens"
          onItemClick={handleAddressClick}
        />
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
