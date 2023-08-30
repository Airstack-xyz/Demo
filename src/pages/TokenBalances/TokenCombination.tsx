import { memo, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../Components/Icon';
import { formatDate } from '../../utils';
import { createTokenHolderUrl } from '../../utils/createTokenUrl';
import { PoapType, TokenType as TokenType } from './types';
import { Asset } from '../../Components/Asset';
import { useSearchInput } from '../../hooks/useSearchInput';

type TokenProps = {
  token: null | TokenType | PoapType;
};

function Token({
  token: tokenProp,
  ownerName
}: {
  token: TokenType | PoapType;
  ownerName: string;
}) {
  const token = (tokenProp || {}) as TokenType;
  const poap = (tokenProp || {}) as PoapType;
  const isPoap = Boolean(poap.poapEvent);
  const poapEvent = poap.poapEvent || {};
  const eventId = poapEvent?.eventId || '';
  const type = token?.tokenType || 'POAP';
  const blockchain = token.blockchain || 'ethereum';
  const tokenName = isPoap ? poapEvent?.eventName : token?.token?.name;
  const image = isPoap ? poapEvent?.logo?.image?.medium : '';
  const address = token.tokenAddress || poap.tokenAddress;
  const tokenId = token?.tokenNfts?.tokenId || poap.tokenId;
  const id = token?.tokenNfts?.tokenId || poapEvent?.eventName || '';
  return (
    <Link
      className="h-[200px] w-[200px] rounded-18 bg-secondary p-2.5 flex flex-col justify-between overflow-hidden relative bg-glass token"
      data-loader-type="block"
      to={createTokenHolderUrl({
        address: isPoap && eventId ? eventId : address,
        inputType: type === 'POAP' ? 'POAP' : 'ADDRESS',
        type,
        blockchain,
        label: tokenName || '--'
      })}
      style={{ textShadow: '0px 0px 2px rgba(0, 0, 0, 0.30)' }}
    >
      <div className="absolute inset-0 [&>div]:w-full [&>div]:h-full [&>div>img]:w-full [&>div>img]:min-w-full flex-col-center">
        <Asset
          image={image}
          address={address}
          tokenId={tokenId}
          chain={blockchain}
          preset="medium"
          useImageOnError={isPoap}
        />
      </div>
      <div className="z-10 flex justify-end items-center">
        <Icon name="holder-white" height={15} width={15} />
        <span className="ml-0.5 text-xs">{ownerName}</span>
      </div>
      <div className="flex items-center rounded-3xl px-3.5 py-2 text-sm bg-glass border-solid-light">
        <div className="ellipsis">
          {!isPoap && '#'}
          {id}
        </div>
      </div>
    </Link>
  );
}

const MAX_TOKENS = 2;
export const TokenCombination = memo(function TokenCombination({
  token: tokenProp
}: TokenProps) {
  const [showAllTokens, setShowAllTokens] = useState(false);
  const [{ address: owners }] = useSearchInput();
  const token = tokenProp as TokenType;
  const poap = tokenProp as PoapType;
  const isPoap = Boolean(poap.poapEvent);
  const poapEvent = poap.poapEvent || {};
  const city = poapEvent.city || '';
  const symbol = token?.token?.symbol || '';
  const type = token?.tokenType || 'POAP';
  const blockchain = token.blockchain || 'ethereum';
  const name = isPoap
    ? `${formatDate(poapEvent.startDate)}${city ? ` (${city})` : ''}`
    : token?.token?.name;

  const [tokens, allTokens]: [TokenType[], TokenType[]] = useMemo(() => {
    const { _common_tokens, ...parentToken } = token;
    const allTokens = [parentToken, ...(_common_tokens || [])];
    if (showAllTokens) return [allTokens, allTokens];
    return [allTokens.slice(0, MAX_TOKENS), allTokens];
  }, [showAllTokens, token]);

  return (
    <div className="border-solid-stroke rounded-18 bg-glass">
      <div className="rounded-18 bg-glass flex items-center justify-between px-3 py-2.5">
        <div>
          {name}
          <span className="ml-0.5">{symbol ? `(${symbol})` : ''}</span>
        </div>
        <div className="flex justify-end">
          <div className="rounded-full h-9 w-9 bg-glass border-solid-light">
            <Icon name={blockchain} className="w-full" />
          </div>
          <div className="h-9 rounded-3xl ml-2.5 border-solid-light flex justify-center items-center px-2 bg-glass">
            {type}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-[20px] gap-y-[20px] justify-center md:justify-start p-5">
        {tokens?.map((_token, index) => {
          return (
            <Token
              token={_token}
              key={index}
              ownerName={index === 0 ? owners[0] : owners[1]}
            />
          );
        })}
        {!showAllTokens && allTokens.length > MAX_TOKENS && (
          <button
            className="bg-glass border-solid-stroke rounded-18 pl-1 pr-1.5 text-text-button font-semibold w-[200px] h-10 sm:h-auto sm:w-auto hover:border-solid-light"
            onClick={() => setShowAllTokens(show => !show)}
          >
            +{allTokens.length - MAX_TOKENS}
          </button>
        )}
      </div>
    </div>
  );
});
