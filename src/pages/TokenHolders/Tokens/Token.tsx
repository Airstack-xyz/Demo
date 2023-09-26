import { Chain } from '@airstack/airstack-react/constants';
import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../../Components/Icon';
import { Asset } from '../../../Components/Asset';
import { getDAppType } from '../utils';
import { Poap, Token as TokenType } from '../types';
import { ListWithMoreOptions } from '../../../Components/ListWithMoreOptions';
import { createTokenBalancesUrl } from '../../../utils/createTokenUrl';
import { WalletAddress } from '../../../Components/WalletAddress';
import classNames from 'classnames';
import {
  resetCachedUserInputs,
  useSearchInput
} from '../../../hooks/useSearchInput';
import { addToActiveTokenInfo } from '../../../utils/activeTokenInfoString';

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
  const primaryEns = owner?.primaryDomain?.name || '';
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
      eventId: string | null;
      has6551?: boolean;
    }[] = [
      {
        image,
        tokenId,
        tokenAddress,
        eventId: poap?.eventId,
        blockchain: token?.blockchain as Chain,
        has6551: token?.tokenNfts?.erc6551Accounts?.length > 0
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
        eventId: token?._eventId,
        blockchain: poap?._blockchain as Chain,
        has6551: token?._tokenNfts?.erc6551Accounts?.length > 0
      });
    }
    return assetData;
  }, [
    image,
    tokenId,
    tokenAddress,
    poap?.eventId,
    poap?._blockchain,
    token?.blockchain,
    token?.tokenNfts?.erc6551Accounts?.length,
    token?._token,
    token?._tokenNfts?.contentValue?.image?.small,
    token?._tokenNfts?.erc6551Accounts?.length,
    token?._poapEvent?.contentValue?.image?.small,
    token?._poapEvent?.logo?.image?.small,
    token?._tokenId,
    token?._tokenAddress,
    token?._eventId
  ]);

  const xmtpEnabled = owner?.xmtp?.find(({ isXMTPEnabled }) => isXMTPEnabled);
  const navigate = useNavigate();
  const [{ activeTokenInfo }, setSearchData] = useSearchInput();

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
      const url = createTokenBalancesUrl({
        address: isFarcaster ? `fc_fname:${address}` : address,
        blockchain: 'ethereum',
        inputType: 'ADDRESS'
      });
      resetCachedUserInputs('tokenBalance');
      navigate(url);
    },
    [navigate]
  );

  const handleAssetClick = useCallback(
    (token: (typeof assets)[0]) => {
      setSearchData(
        {
          activeTokenInfo: addToActiveTokenInfo(token, activeTokenInfo)
        },
        { updateQueryParams: true }
      );
    },
    [activeTokenInfo, setSearchData]
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
          {assets.map(
            ({ tokenAddress, tokenId, blockchain, image, has6551 }, index) => (
              <div className="mr-1.5 last:!mr-0">
                <div
                  className="relative token-img-wrapper w-[50px] h-[50px] rounded-md overflow-hidden flex-col-center cursor-pointer"
                  onClick={() => {
                    handleAssetClick(assets[index]);
                  }}
                >
                  <Asset
                    address={tokenAddress}
                    tokenId={tokenId}
                    preset="small"
                    containerClassName={classNames(
                      'token-img w-full [&>img]:w-full [&>img]:min-w-full z-10 rounded-md overflow-hidden',
                      {
                        '!w-[32px]': has6551
                      }
                    )}
                    chain={blockchain}
                    image={image}
                    videoProps={{
                      controls: false
                    }}
                  />
                  {has6551 && (
                    <div className="absolute z-20 bg-glass w-full rounded-md bottom-0 text-[8px] font-bold text-center border-solid-stroke">
                      ERC6551
                    </div>
                  )}
                  {has6551 && (
                    <div className="absolute blur-md inset-0 flex-col-center">
                      <Asset
                        address={tokenAddress}
                        tokenId={tokenId}
                        preset="small"
                        containerClassName={classNames(
                          'token-img w-full [&>img]:w-full [&>img]:min-w-full rounded-md overflow-hidden',
                          {
                            '!w-40px': has6551
                          }
                        )}
                        chain={blockchain}
                        image={image}
                        videoProps={{
                          controls: false
                        }}
                      />
                    </div>
                  )}
                </div>
                {isCombination && (
                  <div className="text-[10px] mt-1 text-center">#{tokenId}</div>
                )}
              </div>
            )
          )}
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
          list={[primaryEns || '']}
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
