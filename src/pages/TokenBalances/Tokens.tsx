import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { useState, useEffect } from 'react';
import { query } from '../../queries';
import { SectionHeader } from './SectionHeader';
import { TokenType as TokenType } from './types';

type TokenProps = {
  type: string;
  name: string;
  id: string;
  address: string;
  symbol: string;
};
function Token({ type, name, symbol }: TokenProps) {
  return (
    <div className="h-72 w-72 rounded-xl bg-secondary p-2.5 flex flex-col justify-between bg-[url('/images/temp.png')]">
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

export function Tokens({ owner = 'vitalik.eth' }: { owner?: string }) {
  const [fetch, { data }] = useLazyQueryWithPagination(query);
  // const { hasNextPage, getNextPage } = pagination;

  const [tokens, setTokens] = useState<TokenType[]>([]);

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

  return (
    <div>
      <SectionHeader iconName="nft-flat" heading="Tokens" />
      <div className="grid grid-cols-3 gap-11 mt-3.5">
        {tokens.map((token, index) => (
          <Token
            key={index}
            address={token.tokenAddress}
            name={token.token.name}
            type={token.tokenType}
            id={token.tokenNfts.tokenId}
            symbol={token.token.symbol}
          />
        ))}
      </div>
    </div>
  );
}
