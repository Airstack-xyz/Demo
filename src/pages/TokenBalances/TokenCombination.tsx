import { memo, useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../Components/Icon';
import { formatDate } from '../../utils';
import { createTokenHolderUrl } from '../../utils/createTokenUrl';
import { PoapType, TokenType as TokenType } from './types';
import { Asset } from '../../Components/Asset';
import { useSearchInput } from '../../hooks/useSearchInput';
import classNames from 'classnames';
import { isMobileDevice } from '../../utils/isMobileDevice';
import { getActiveTokenInfoString } from '../../utils/activeTokenInfoString';

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
  const setSearchData = useSearchInput()[1];
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
  const id = token?.tokenNfts?.tokenId || poap.tokenId || '';

  const handleClick = useCallback(() => {
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
  }, [address, blockchain, eventId, setSearchData, tokenId]);
  return (
    <div
      className="group h-[300px] w-[300px] sm:h-[200px] sm:w-[200px] rounded-18 bg-secondary p-2.5 flex flex-col justify-between overflow-hidden relative bg-glass token cursor-pointer"
      data-loader-type="block"
      onClick={handleClick}
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
      <div className="z-10 flex justify-between items-center text-xs relative">
        <Link
          className="left-0 top-1 text-sm bg-white rounded-18 text-primary flex py-2 px-3 items-center visible sm:invisible group-hover:visible border border-solid border-transparent hover:border-text-secondary"
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
        </Link>
        <div className="flex items-center">
          <Icon name="holder-white" height={15} width={15} />
          <span className="ml-0.5 text-xs">{ownerName}</span>
        </div>
      </div>
      <div className="flex items-center rounded-3xl px-3.5 py-2 text-xs bg-glass border-solid-light">
        <div className="ellipsis">#{id}</div>
      </div>
    </div>
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
    ? `${poapEvent.eventName} (${formatDate(poapEvent.startDate)}${city || ''})`
    : token?.token?.name;

  const [tokens, allTokens]: [TokenType[], TokenType[]] = useMemo(() => {
    const { _common_tokens, ...parentToken } = token;
    const allTokens = [parentToken, ...(_common_tokens || [])];
    if (showAllTokens) return [allTokens, allTokens];
    return [allTokens.slice(0, MAX_TOKENS), allTokens];
  }, [showAllTokens, token]);

  const headingWidth = isMobileDevice()
    ? 'auto'
    : Math.min(4, tokens.length) * 150;
  const hasMoreTokens = allTokens.length > MAX_TOKENS;

  return (
    <div
      className={classNames('border-solid-stroke rounded-18 bg-glass flex-1', {
        'w-[80%] sm:max-w-full lg:max-w-[49%] ': !showAllTokens
      })}
    >
      <div className="rounded-18 bg-glass flex items-center justify-between px-3 py-2.5">
        <div
          className="flex mr-1.5 text-sm ellipsis"
          style={{ width: headingWidth }}
        >
          <span className="ellipsis">
            {name} {symbol ? `(${symbol})` : ''}
          </span>
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
      <div
        className={classNames(
          'flex flex-col sm:flex-row flex-wrap gap-x-[20px] gap-y-[20px] items-center justify-center sm:justify-evenly p-5',
          {
            'gap-x-[8px] px-1.5': !showAllTokens && hasMoreTokens,
            '!justify-center': showAllTokens
          }
        )}
      >
        {tokens?.map((_token, index) => {
          return (
            <Token
              token={_token}
              key={index}
              ownerName={index === 0 ? owners[0] : owners[1]}
            />
          );
        })}
        {!showAllTokens && hasMoreTokens && (
          <button
            className="bg-glass border-solid-stroke rounded-18 pl-1 pr-1.5 text-text-button font-semibold w-[300px] sm:w-auto h-10 sm:h-[200px] hover:border-solid-light"
            onClick={() => setShowAllTokens(show => !show)}
          >
            +{allTokens.length - MAX_TOKENS}
          </button>
        )}
      </div>
    </div>
  );
});
