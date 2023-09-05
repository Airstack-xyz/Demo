import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../Components/Icon';
import { formatDate } from '../../utils';
import { createTokenHolderUrl } from '../../utils/createTokenUrl';
import { PoapsType, TokenType as TokenType } from './types';
import { Asset } from '../../Components/Asset';
import classNames from 'classnames';
import { Nft } from './erc20-types';
import { useSearchInput } from '../../hooks/useSearchInput';

type Poap = PoapsType['Poaps']['Poap'][0];

type TokenProps = {
  token: null | TokenType | Poap | Nft;
};

export const Token = memo(function Token({ token: tokenProp }: TokenProps) {
  const setSearchData = useSearchInput()[1];

  const token = (tokenProp || {}) as TokenType;
  const poap = (tokenProp || {}) as Poap;
  const nft = (tokenProp || {}) as Nft;
  const isPoap = Boolean(poap.poapEvent);
  const poapEvent = poap.poapEvent || {};
  const city = poapEvent.city || '';

  const address = nft?.address || token.tokenAddress || poap.tokenAddress;
  const tokenId = nft?.tokenId || token?.tokenNfts?.tokenId || poap.tokenId;

  const ids = useMemo(() => {
    if (isPoap) return [poapEvent?.eventName];
    return [tokenId, token?._tokenId].filter(Boolean);
  }, [isPoap, poapEvent?.eventName, token?._tokenId, tokenId]);

  const symbol = token?.token?.symbol || '';
  const type = nft.type || token?.tokenType || 'POAP';
  const blockchain = token.blockchain || 'ethereum';
  const name = isPoap
    ? `${formatDate(poapEvent.startDate)}${city ? ` (${city})` : ''}`
    : token?.token?.name;
  const image = isPoap ? poapEvent?.logo?.image?.medium : '';
  const eventId = poapEvent?.eventId || '';
  const tokenName = isPoap ? poapEvent?.eventName : token?.token?.name;

  return (
    <div
      className="h-[300px] w-[300px] rounded-18 bg-secondary p-2.5 flex flex-col justify-between overflow-hidden relative bg-glass token"
      data-loader-type="block"
      onClick={() => {
        setSearchData(
          {
            tokenBalancesActiveViewInfo: `${address} ${tokenId} ${blockchain} ${eventId}`
          },
          { updateQueryParams: true }
        );
      }}
      style={{ textShadow: '0px 0px 2px rgba(0, 0, 0, 0.30)' }}
    >
      <div className="absolute inset-0 [&>div]:w-full [&>div]:h-full [&>div>img]:w-full [&>div>img]:min-w-full flex-col-center">
        {(image || (address && tokenId)) && (
          <Asset
            image={image}
            address={address}
            tokenId={tokenId}
            chain={blockchain}
            preset="medium"
            useImageOnError={isPoap}
          />
        )}
      </div>
      <div className="flex justify-between z-10">
        <Link
          className="text-sm bg-white rounded-18 text-primary flex py-2 px-3 items-center"
          to={createTokenHolderUrl({
            address: isPoap && eventId ? eventId : address,
            inputType: type === 'POAP' ? 'POAP' : 'ADDRESS',
            type,
            blockchain,
            label: tokenName || '--'
          })}
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
      <div className="h-14 rounded-3xl flex flex-col px-3.5 py-2 text-sm bg-glass border-solid-light">
        <div className="ellipsis text-xs mb-">{name || '--'}</div>
        <div className="flex items-center justify-between font-bold ">
          <div className="ellipsis flex flex-1 mr-2">
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
          <div className="ellipsis text-right max-w-[50%]">{symbol || ''}</div>
        </div>
      </div>
    </div>
  );
});
