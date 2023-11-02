import { Chain } from '@airstack/airstack-react/constants';
import classNames from 'classnames';
import { useMemo } from 'react';
import { Asset } from '../../../Components/Asset';
import { Icon } from '../../../Components/Icon';
import { ListWithMoreOptions } from '../../../Components/ListWithMoreOptions';
import { WalletAddress } from '../../../Components/WalletAddress';
import { Poap, Token as TokenType } from '../types';
import { formatNumber } from '../../../utils/formatNumber';

export type AssetType = {
  image: string;
  tokenId: string;
  tokenAddress: string;
  blockchain: Chain;
  eventId: string | null;
  has6551?: boolean;
  formattedAmount?: string;
};

export function Token({
  token: tokenInProps,
  isCombination,
  onShowMoreClick,
  onAddressClick,
  onAssetClick
}: {
  token: TokenType | Poap | null;
  isCombination: boolean;
  onShowMoreClick?: (addresses: string[], dataType?: string) => void;
  onAddressClick?: (address: string, type?: string) => void;
  onAssetClick?: (asset: AssetType) => void;
}) {
  const owner = tokenInProps?.owner;
  const walletAddresses = owner?.addresses || [];
  const walletAddress = walletAddresses[0] || '';
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
    const assetData: AssetType[] = [
      {
        image,
        tokenId,
        tokenAddress,
        formattedAmount:
          token?.tokenType === 'ERC20' && token.formattedAmount != null
            ? formatNumber(token.formattedAmount)
            : undefined,
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
        formattedAmount:
          innerToken?.tokenType === 'ERC20' &&
          innerToken.formattedAmount != null
            ? formatNumber(innerToken.formattedAmount)
            : undefined,
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
    token?.tokenType,
    token?.formattedAmount,
    token?.blockchain,
    token?.tokenNfts?.erc6551Accounts?.length,
    token?._token,
    token?._tokenNfts?.contentValue?.image?.small,
    token?._tokenNfts?.erc6551Accounts?.length,
    token?._poapEvent?.contentValue?.image?.small,
    token?._poapEvent?.logo?.image?.small,
    token?._tokenId,
    token?._tokenAddress,
    token?._eventId,
    poap?.eventId,
    poap?._blockchain
  ]);

  const xmtpEnabled = owner?.xmtp?.find(({ isXMTPEnabled }) => isXMTPEnabled);

  const lensAddresses =
    owner?.socials
      ?.filter(item => item.dappName === 'lens')
      .map(item => item.profileName) || [];
  const farcasterAddresses =
    owner?.socials
      ?.filter(item => item.dappName === 'farcaster')
      .map(item => item.profileName) || [];

  const getShowMoreHandler = (addresses: string[], type: string) => () =>
    onShowMoreClick?.([...addresses, ...walletAddresses], type);

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
            (
              {
                tokenAddress,
                tokenId,
                blockchain,
                image,
                has6551,
                formattedAmount
              },
              index
            ) => (
              <div key={tokenId} className="mr-1.5 last:!mr-0">
                <div
                  className="relative token-img-wrapper w-[50px] h-[50px] rounded-md overflow-hidden flex-col-center cursor-pointer"
                  onClick={() => {
                    onAssetClick?.(assets[index]);
                  }}
                >
                  <Asset
                    address={tokenAddress}
                    tokenId={tokenId}
                    preset="small"
                    containerClassName={classNames(
                      'token-img w-full [&>img]:w-full [&>img]:min-w-full rounded-md overflow-hidden',
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
                  <div className="text-[10px] mt-1 text-center">
                    {formattedAmount || `#${tokenId}`}
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </td>
      <td className="ellipsis">
        <WalletAddress address={walletAddress} onClick={onAddressClick} />
      </td>
      {!isCombination && (
        <td className="ellipsis">
          {token?.tokenType === 'ERC20' && token.formattedAmount != null
            ? formatNumber(token.formattedAmount)
            : tokenId
            ? `#${tokenId}`
            : '--'}
        </td>
      )}
      <td className="ellipsis">
        <ListWithMoreOptions
          list={[primaryEns || '']}
          listFor="ens"
          onShowMore={getShowMoreHandler(ens, 'ens')}
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
