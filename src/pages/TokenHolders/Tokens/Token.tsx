import { Chain } from '@airstack/airstack-react/constants';
import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../../Components/Icon';
import { Asset } from '../../../Components/Asset';
import { getDAppType } from '../utils';
import { Poap, Token as TokenType } from '../types';
import { ListWithMoreOptions } from './ListWithMoreOptions';
import { createTokenBalancesUrl } from '../../../utils/createTokenUrl';
import { WalletAddress } from './WalletAddress';
import classNames from 'classnames';

export function Token({
  token: tokenInProps,
  isCombination,
  onShowMore
}: {
  token: TokenType | Poap | null;
  onShowMore?: (value: string[], dataType: string) => void;
  isCombination: boolean;
}) {
  const owner = tokenInProps?.owner;
  const walletAddresses = owner?.addresses || '';
  const walletAddress = Array.isArray(walletAddresses)
    ? walletAddresses[0]
    : '';
  const tokenId = tokenInProps?.tokenId || '';
  const tokenAddress = tokenInProps?.tokenAddress || '';
  const primarEns = owner?.primaryDomain?.name || '';
  const ens = owner?.domains?.map(domain => domain.name) || [];
  const token = tokenInProps as TokenType;
  const poap = tokenInProps as Poap;
  const image =
    token?.token?.logo?.small ||
    token?.tokenNfts?.contentValue?.image?.small ||
    token?.token?.projectDetails?.imageUrl ||
    poap?.poapEvent?.contentValue?.image?.small ||
    poap?.poapEvent?.logo?.image?.small;

  const assets = useMemo(() => {
    const assetData: {
      image: string;
      tokenId: string;
      tokenAddress: string;
      blockchain: Chain;
      isPoap: boolean;
    }[] = [
      {
        image,
        tokenId,
        tokenAddress,
        isPoap: !!poap?.poapEvent,
        blockchain: token?.blockchain as Chain
      }
    ];
    const innerToken = token?._token;
    const _image =
      innerToken?.logo?.small ||
      token?._tokenNfts?.contentValue?.image?.small ||
      innerToken?.projectDetails?.imageUrl ||
      token?._poapEvent?.contentValue?.image?.small ||
      token?._poapEvent?.logo?.image?.small;
    if (_image || token?._tokenId) {
      assetData.push({
        image: _image,
        tokenId: token?._tokenId || '',
        tokenAddress: token?._tokenAddress || '',
        isPoap: !!token?._poapEvent,
        blockchain: poap?._blockchain as Chain
      });
    }
    return assetData;
  }, [
    image,
    tokenId,
    tokenAddress,
    poap?.poapEvent,
    poap?._blockchain,
    token?.blockchain,
    token?._token,
    token?._tokenNfts?.contentValue?.image?.small,
    token?._poapEvent,
    token?._tokenId,
    token?._tokenAddress
  ]);

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
      <td
        className={classNames({
          '!pl-9': !isCombination,
          '!pl-3': isCombination
        })}
      >
        <div className="flex">
          {assets.map(asset => (
            <div className="mr-1.5 last:!mr-0">
              <div className="token-img-wrapper w-[50px] h-[50px] rounded-md overflow-hidden [&>div]:w-full [&>div>img]:w-full [&>div>img]:min-w-full flex-col-center">
                <Asset
                  address={asset.tokenAddress}
                  tokenId={asset.tokenId}
                  preset="small"
                  containerClassName="token-img"
                  chain={asset.blockchain}
                  image={asset.image}
                  videoProps={{
                    controls: false
                  }}
                />
              </div>
              {isCombination && (
                <div className="text-[10px] mt-1 text-center">
                  #{asset.tokenId}
                </div>
              )}
            </div>
          ))}
        </div>
      </td>
      <td className="ellipsis">
        <WalletAddress address={walletAddress} onClick={handleAddressClick} />
      </td>
      {!isCombination && (
        <td className="ellipsis">
          {token?.tokenType === 'ERC20'
            ? token?.formattedAmount
            : tokenId
            ? `#${tokenId}`
            : '--'}
        </td>
      )}
      <td className="ellipsis">
        {}
        <ListWithMoreOptions
          list={[primarEns || '']}
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
