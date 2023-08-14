import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../Components/Icon';
import { formatDate } from '../../utils';
import { createTokenHolderUrl } from '../../utils/createTokenUrl';
import { PoapsType, TokenType as TokenType } from './types';
import { Asset } from '../../Components/Asset';

type Poap = PoapsType['Poaps']['Poap'][0];

type TokenProps = {
  token: null | TokenType | Poap;
};

export const Token = memo(function Token({ token: tokenProp }: TokenProps) {
  const token = (tokenProp || {}) as TokenType;
  const poap = (tokenProp || {}) as Poap;
  const isPoap = Boolean(poap.poapEvent);
  const poapEvent = poap.poapEvent || {};
  const city = poapEvent.city || '';

  const address = token.tokenAddress || poap.tokenAddress;
  const id = token?.tokenNfts?.tokenId
    ? '#' + token?.tokenNfts?.tokenId
    : poapEvent?.eventName;

  const symbol = token?.token?.symbol || '';
  const type = token?.tokenType || 'POAP';
  const blockchain = token.blockchain || 'ethereum';
  const name =
    token?.token?.name ||
    `${formatDate(poapEvent.startDate)}${city ? ` (${city})` : ''}`;
  const tokenId = token?.tokenNfts?.tokenId || poap.tokenId;
  const image = isPoap ? poapEvent?.logo?.image?.medium : '';
  const eventId = poapEvent?.eventId || '';
  const tokenName = isPoap ? poapEvent?.eventName : token?.token?.name;

  return (
    <Link
      className="h-[300px] w-[300px] rounded-18 bg-secondary p-2.5 flex flex-col justify-between overflow-hidden relative bg-glass token"
      data-loader-type="block"
      to={createTokenHolderUrl({
        address: isPoap && eventId ? eventId : address,
        inputType: type === 'POAP' ? 'POAP' : 'ADDRESS',
        type,
        blockchain,
        label: tokenName
      })}
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
          />
        )}
      </div>
      <div className="flex justify-end">
        <div className="rounded-full h-9 w-9 bg-glass border-solid-light">
          <Icon name={blockchain} className="w-full" />
        </div>
        <div className="h-9 rounded-3xl ml-2.5 border-solid-light flex justify-center items-center px-2 bg-glass">
          {type}
        </div>
      </div>
      <div className="h-14 rounded-3xl flex flex-col px-3.5 py-2 text-sm bg-glass border-solid-light">
        <div className="ellipsis text-xs mb-">{name}</div>
        <div className="flex items-center justify-between font-bold ">
          <div className="ellipsis flex-1 mr-2">{id}</div>
          <div>{symbol || ''}</div>
        </div>
      </div>
    </Link>
  );
});
