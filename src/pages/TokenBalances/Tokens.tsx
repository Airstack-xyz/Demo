import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { useState, useEffect } from 'react';
import { POAPQuery, tokensQuery } from '../../queries';
import { PoapType, TokenType as TokenType } from './types';
import classNames from 'classnames';
import { useSearchInput } from '../../hooks/useSearchInput';
import { formatDate } from '../../utils';
import { tokenTypes } from './constants';
import { Icon } from '../../Components/Icon';
import { Link } from 'react-router-dom';
import { createTokenHolderUrl } from '../../utils/createTokenHolderUrl';
import { Asset } from '../../Components/Asset';

type TokenProps = {
  type: string;
  name: string;
  id: string;
  address: string;
  symbol: string;
  blockchain: 'ethereum' | 'polygon';
  tokenId: string;
};
function Token({
  type,
  name,
  symbol,
  address,
  id,
  blockchain = 'ethereum',
  tokenId
}: TokenProps) {
  return (
    <Link
      className="h-72 w-72 rounded-18 bg-secondary p-2.5 flex flex-col justify-between overflow-hidden relative glass-effect"
      data-loader-type="block"
      to={createTokenHolderUrl(address)}
      style={{ textShadow: '0px 0px 2px rgba(0, 0, 0, 0.30)' }}
    >
      <div className="absolute inset-0 [&>div]:w-full [&>div]:h-full [&>div>img]:w-full">
        {address && tokenId && (
          <Asset
            address={address}
            tokenId={tokenId}
            chain={blockchain}
            preset="medium"
          />
        )}
      </div>
      <div className="flex justify-end">
        <div className="rounded-full h-9 w-9 glass-effect">
          <Icon name={blockchain} className="w-full" />
        </div>
        <div className="h-9 rounded-3xl ml-2.5 border border-solid border-stroke-color flex justify-center items-center px-2 glass-effect">
          {type}
        </div>
      </div>
      <div className="h-14 rounded-3xl border border-solid border-stroke-color flex flex-col px-3.5 py-2 text-sm glass-effect">
        <div className="ellipsis text-xs mb-">{name}</div>
        <div className="flex items-center justify-between font-bold ">
          <div className="ellipsis flex-1 mr-2">{id}</div>
          <div>{symbol || ''}</div>
        </div>
      </div>
    </Link>
  );
}

const loaderData = Array(9).fill({ token: {}, tokenNfts: {} });

type Poap = PoapType['Poaps']['Poap'][0];
const variables = {};
const config = {
  cache: false
};
export function Tokens() {
  const [fetchTokens, { data: tokensData, loading: loadingTokens }] =
    useLazyQueryWithPagination(tokensQuery, variables, config);
  const [fetchPoaps, { data: poapsData, loading: loadingPoaps }] =
    useLazyQueryWithPagination(POAPQuery, variables, config);
  // const { hasNextPage, getNextPage } = pagination;

  const [tokens, setTokens] = useState<TokenType[]>([]);
  const [poaps, setPoaps] = useState<Poap[]>([]);
  const { address: owner, filterBy: tokenType = '' } = useSearchInput();
  useEffect(() => {
    if (owner) {
      if (!tokenType || tokenType !== 'POAP') {
        fetchTokens({
          owner,
          limit: 10,
          tokenType:
            tokenType.length > 0
              ? [tokenType]
              : tokenTypes.filter(tokenType => tokenType !== 'POAP')
        });
      }

      if (!tokenType || tokenType === 'POAP') {
        fetchPoaps({
          owner,
          limit: 20
        });
      }
      setTokens([]);
      setPoaps([]);
    }
  }, [fetchPoaps, fetchTokens, owner, tokenType]);

  useEffect(() => {
    if (tokensData) {
      const { ethereum, polygon } = tokensData;
      const ethTokens = ethereum?.TokenBalance || [];
      const maticTokens = polygon?.TokenBalance || [];
      setTokens(tokens => [...tokens, ...ethTokens, ...maticTokens]);
    }
  }, [tokensData]);

  useEffect(() => {
    if (poapsData) {
      setPoaps(poaps => [...poaps, ...(poapsData?.Poaps?.Poap || [])]);
    }
  }, [poapsData]);

  const loading = loadingTokens || loadingPoaps;
  const items: (TokenType | Poap)[] = loading
    ? loaderData
    : [...tokens, ...poaps];

  if (items.length === 0 && !loading) {
    return (
      <div className="flex flex-1 justify-center mt-10">No data found!</div>
    );
  }

  return (
    <div className="flex flex-wrap gap-x-[75px] gap-y-[75px] justify-center">
      {items.map((_token, index) => {
        const token = _token as TokenType;
        const poap = _token as Poap;
        const poapEvent = poap.poapEvent || {};
        const city = poapEvent.city || '';

        const address = token.tokenAddress || poap.tokenAddress;
        const id = token.tokenNfts?.tokenId
          ? '#' + token.tokenNfts?.tokenId
          : poapEvent.eventName;
        const symbol = token?.token?.symbol || '';
        const type = token.tokenType || 'POAP';
        const blockchain = token.blockchain || 'ethereum';
        const name =
          token?.token?.name ||
          `${formatDate(poapEvent.startDate)}${city ? ` (${city})` : ''}`;
        const tokenId = token.tokenNfts?.tokenId || poap.tokenId;
        return (
          <div
            className={classNames({
              'skeleton-loader': loading
            })}
          >
            <Token
              key={index}
              type={type}
              name={name}
              id={id}
              address={address}
              symbol={symbol}
              blockchain={blockchain}
              tokenId={tokenId}
            />
          </div>
        );
      })}
    </div>
  );
}
