import { Asset, useLazyQueryWithPagination } from '@airstack/airstack-react';
import { useState, useEffect } from 'react';
import { query } from '../../queries';
import { TokenType as TokenType } from './types';
import classNames from 'classnames';
import { useSearchInput } from '../../hooks/useSearchInput';

type TokenProps = {
  type: string;
  name: string;
  id: string;
  address: string;
  symbol: string;
  blockchain: 'ethereum' | 'polygon';
};
function Token({ type, name, symbol, address, id, blockchain }: TokenProps) {
  return (
    <div
      className="h-72 w-72 rounded-xl bg-secondary p-2.5 flex flex-col justify-between bg-[url('/images/temp.png')]"
      data-loader-type="block"
      data-loader-height="auto"
    >
      {address && id && (
        <Asset address={address} tokenId={id} chain={blockchain} />
      )}
      <div className="flex justify-end">
        <div className="rounded-full h-9 w-9 border-solid border-stroke-color border glass-effect"></div>
        <div className="h-9 rounded-3xl ml-2.5 border border-solid border-stroke-color flex justify-center items-center px-2 glass-effect">
          {type}
        </div>
      </div>
      <div className="h-14 rounded-3xl ml-2.5 border border-solid border-stroke-color flex flex-col px-3.5 py-2 text-sm glass-effect">
        <div className="overflow-ellipsis whitespace-nowrap overflow-hidden">
          {name}
        </div>
        <div className="flex items-center justify-between">
          <div>#6721</div>
          <div>{symbol || '--'}</div>
        </div>
      </div>
    </div>
  );
}

const loaderData = Array(9).fill({ token: {}, tokenNfts: {} });

export function Tokens() {
  const [fetch, { data, loading }] = useLazyQueryWithPagination(query);
  // const { hasNextPage, getNextPage } = pagination;

  const [tokens, setTokens] = useState<TokenType[]>([]);
  const { query: owner } = useSearchInput();

  useEffect(() => {
    if (owner) {
      fetch({
        owner,
        limit: 10
      });
      setTokens([]);
    }
  }, [fetch, owner]);

  useEffect(() => {
    if (data) {
      const { ethereum, polygon } = data;
      const ethTokens = ethereum?.TokenBalance || [];
      const maticTokens = polygon?.TokenBalance || [];
      setTokens(tokens => [...tokens, ...ethTokens, ...maticTokens]);
    }
  }, [data]);

  // const handleNext = useCallback(() => {
  //   if (hasNextPage) {
  //     getNextPage();
  //   }
  // }, [getNextPage, hasNextPage]);

  // const dataNotFound = !error && !loading && tokens.length === 0;
  // console.log('tokens', tokens);

  const items = loading ? loaderData : tokens;

  return (
    <div>
      <div className={classNames('grid grid-cols-3 gap-11 mt-3.5')}>
        {items.map((token, index) => (
          <div
            className={classNames({
              'skeleton-loader': loading
            })}
          >
            <Token
              key={index}
              address={token.tokenAddress}
              name={token.token.name}
              type={token.tokenType}
              id={token.tokenNfts.tokenId}
              symbol={token.token.symbol}
              blockchain={token.blockchain}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
