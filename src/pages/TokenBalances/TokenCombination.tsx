import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../Components/Icon';
import { formatDate } from '../../utils';
import { createTokenHolderUrl } from '../../utils/createTokenUrl';
import { PoapType, TokenType as TokenType } from './types';
import { Asset } from '../../Components/Asset';
import classNames from 'classnames';

type TokenProps = {
  token: null | TokenType | PoapType;
};

function Token({ token: tokenProp }: { token: TokenType | PoapType }) {
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
  const id = token?.tokenNfts?.tokenId || 'no_id';
  return (
    <Link
      className="h-[300px] w-[300px] rounded-18 bg-secondary p-2.5 flex flex-col justify-between overflow-hidden relative bg-glass token"
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
      <div className="h-14 rounded-3xl flex flex-col px-3.5 py-2 text-sm bg-glass border-solid-light">
        <div className="flex items-center justify-between font-bold ">
          <div className="ellipsis flex flex-1 mr-2">
            <span className={classNames('ellipsis')}>
              {!isPoap && '#'}
              {id}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export const TokenCombination = memo(function TokenCombination({
  token: tokenProp
}: TokenProps) {
  const token = tokenProp as TokenType;
  const poap = tokenProp as PoapType;
  const isPoap = Boolean(poap.poapEvent);
  const poapEvent = poap.poapEvent || {};
  const city = poapEvent.city || '';

  const type = token?.tokenType || 'POAP';
  const blockchain = token.blockchain || 'ethereum';
  const name = isPoap
    ? `${formatDate(poapEvent.startDate)}${city ? ` (${city})` : ''}`
    : token?.token?.name;

  const tokens: TokenType[] = useMemo(() => {
    const { _common_tokens, ...parentToken } = token;
    return [parentToken, ...(_common_tokens || [])];
  }, [token]);

  return (
    <div>
      <div className="">
        <div>{name}</div>
        <div className="flex justify-end">
          <div className="rounded-full h-9 w-9 bg-glass border-solid-light">
            <Icon name={blockchain} className="w-full" />
          </div>
          <div className="h-9 rounded-3xl ml-2.5 border-solid-light flex justify-center items-center px-2 bg-glass">
            {type}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-[55px] gap-y-[55px] justify-center md:justify-start mb-10">
        {tokens?.map((_token, index) => {
          return <Token token={_token} key={index} />;
        })}
      </div>
    </div>
  );
});
