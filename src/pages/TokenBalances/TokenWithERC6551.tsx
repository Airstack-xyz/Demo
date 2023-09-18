import { memo, useMemo } from 'react';
import { Icon } from '../../Components/Icon';
import { formatDate } from '../../utils';
import { PoapsType, TokenType as TokenType } from './types';
import { Asset } from '../../Components/Asset';
import classNames from 'classnames';
import { Nft } from './erc20-types';
import { useSearchInput } from '../../hooks/useSearchInput';
import { createTokenHolderUrl } from '../../utils/createTokenUrl';
import { Link } from 'react-router-dom';
import { getActiveTokenInfoString } from '../../utils/activeTokenInfoString';

type Poap = PoapsType['Poaps']['Poap'][0];

type TokenProps = {
  token: null | TokenType | Poap | Nft;
};

export const TokenWithERC6551 = memo(function Token({
  token: tokenProp
}: TokenProps) {
  const setSearchData = useSearchInput()[1];
  const token = (tokenProp || {}) as TokenType;
  const poap = (tokenProp || {}) as Poap;
  const isPoap = Boolean(poap.poapEvent);
  const poapEvent = poap.poapEvent || {};
  const city = poapEvent.city || '';

  const address = token.tokenAddress || poap.tokenAddress;
  const tokenId =
    (tokenProp as Nft)?.tokenId || token?.tokenNfts?.tokenId || poap.tokenId;
  const ids = useMemo(() => {
    if (isPoap) return [poapEvent?.eventName];
    return [tokenId, token?._tokenId].filter(Boolean);
  }, [isPoap, poapEvent?.eventName, token?._tokenId, tokenId]);

  const symbol = token?.token?.symbol || '';
  const type = token?.tokenType || 'POAP';
  const blockchain = token.blockchain || 'ethereum';
  const name = isPoap
    ? `${formatDate(poapEvent.startDate)}${city ? ` (${city})` : ''}`
    : token?.token?.name;

  const image = isPoap ? poapEvent?.logo?.image?.medium : '';
  const eventId = poapEvent?.eventId || '';
  const tokenName = isPoap ? poapEvent?.eventName : token?.token?.name;

  const erc6551Accounts = token.tokenNfts?.erc6551Accounts;

  const nestedTokens = useMemo(() => {
    if (!erc6551Accounts || erc6551Accounts?.length === 0) {
      return [] as TokenType[];
    }

    return erc6551Accounts.reduce((tokens: TokenType[], token) => {
      if (token?.address?.tokenBalances) {
        return [...tokens, ...token.address.tokenBalances];
      }
      return tokens;
    }, []);
  }, [erc6551Accounts]);

  const assets = useMemo(() => {
    if (!address || !tokenId) return null;
    const assets = [
      {
        image,
        address: address,
        tokenId: tokenId,
        chain: blockchain
      }
    ];

    nestedTokens.forEach(token => {
      if (assets.length < 3) {
        assets.push({
          image: '',
          address: token.tokenAddress,
          tokenId: token?.tokenId || '',
          chain: blockchain
        });
      }
    });
    return assets.map((asset, index) => (
      <div
        key={index}
        className="w-[173px] h-[173px] absolute rounded-18 overflow-hidden shadow-md bg-secondary"
        style={{ rotate: `${index * 10}deg`, zIndex: assets.length - index }}
      >
        <Asset
          image={asset.image}
          address={asset.address}
          tokenId={asset.tokenId}
          chain={asset.chain}
          preset="medium"
          containerClassName="w-full h-full flex items-center"
        />
      </div>
    ));
  }, [address, blockchain, image, nestedTokens, tokenId]);

  return (
    <div
      className="group h-[300px] w-[300px] rounded-18 bg-secondary p-2.5 flex flex-col justify-between overflow-hidden relative bg-glass token cursor-pointer"
      data-loader-type="block"
      onClick={() => {
        setSearchData(
          {
            activeTokenInfo: getActiveTokenInfoString(
              address,
              tokenId,
              blockchain,
              eventId
            )
          },
          { updateQueryParams: true }
        );
      }}
      style={{ textShadow: '0px 0px 2px rgba(0, 0, 0, 0.30)' }}
    >
      {address && tokenId && (
        <div className="absolute blur-md inset-0">
          <Asset
            image={image}
            address={address}
            tokenId={tokenId}
            chain={blockchain}
            preset="medium"
            containerClassName="w-full h-full [&>img]:w-full [&>img]:min-w-full"
          />
        </div>
      )}
      <div className="absolute inset-0 [&>div]:w-[173px] [&>div]:h-[173px] [&>div>img]:w-full [&>div>img]:min-w-full flex-col-center">
        {assets}
      </div>
      <div className="flex justify-between z-10">
        <Link
          className="text-sm bg-white rounded-18 text-primary flex py-2 px-3 items-center sm:invisible group-hover:visible border border-solid border-transparent hover:border-text-secondary"
          to={createTokenHolderUrl({
            address: isPoap && eventId ? eventId : address,
            inputType: type === 'POAP' ? 'POAP' : 'ADDRESS',
            type,
            blockchain,
            label: tokenName || '--'
          })}
          onClick={e => e.stopPropagation()}
        >
          <Icon width={16} name="token-holders" />
          <span className="ml-1.5">Holders</span>
        </Link>
        <div className="flex">
          <div className="rounded-full h-9 w-9 bg-glass border-solid-light">
            <Icon name={blockchain} className="w-full" />
          </div>
          <div className="h-9 rounded-3xl ml-2.5 border-solid-light flex justify-center items-center px-2 bg-glass">
            {type}
          </div>
        </div>
      </div>

      <div className="z-10 rounded-3xl flex flex-col px-3.5 pt-3.5 pb-3 text-sm bg-glass border-solid-light font-medium">
        <div className="flex flex-col text-sm z-10">
          <div className="flex items-center text-xs">
            <span className="bg-[#5a8178] px-1.5 py-0.5 rounded-18 mr-1.5 flex items-center">
              <Icon name="folder-gray" className="ml-1 mr-1.5" />
              <span>ERC6551</span>
            </span>
            <span>
              {nestedTokens.length} asset{nestedTokens.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="ellipsis text-xs font-semibold my-1.5">
            {name || '--'}
          </div>
          <div className="flex items-center justify-between">
            <div className="ellipsis flex flex-1 mr-2 font-normal">
              {ids.map((id, index) => (
                <>
                  <span
                    key={id}
                    className={classNames('ellipsis', {
                      'max-w-[50%]': ids.length > 1
                    })}
                  >
                    {!isPoap && '#'}
                    {id}
                  </span>
                  {index < ids.length - 1 && <span className="mr-1">,</span>}
                </>
              ))}
            </div>
            <div className="ellipsis text-right max-w-[50%]">
              {symbol || ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
