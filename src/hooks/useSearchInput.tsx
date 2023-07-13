import { useMatch, useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

export type cachedQuery = {
  address?: string;
  blockchain?: string;
  filterBy?: string;
  rawInput?: string;
};

const cache = {
  tokenBalance: {} as cachedQuery,
  tokenHolder: {} as cachedQuery
};

export function useSearchInput() {
  let isTokenBalances = !!useMatch('/token-balances');
  const isHome = useMatch('/');

  if (isHome) {
    isTokenBalances = true;
  }
  const { tokenBalance, tokenHolder } = cache;
  const [searchParams] = useSearchParams();

  const setData = useCallback(
    (data: cachedQuery) => {
      if (isTokenBalances) {
        cache.tokenBalance = { ...cache.tokenBalance, ...data };
      } else {
        cache.tokenHolder = { ...cache.tokenHolder, ...data };
      }
    },
    [isTokenBalances]
  );

  return useMemo(() => {
    const {
      rawInput: rawQuery,
      address,
      blockchain: savedBlockchain,
      filterBy
    } = isTokenBalances ? tokenBalance : tokenHolder;

    const query = searchParams.get('address') || '';
    const tokenType = searchParams.get('filterBy') || '';
    const blockchain = searchParams.get('blockchain') || '';
    const rawInput = searchParams.get('rawInput') || '';

    const data = {
      address: query || address || '',
      filterBy: tokenType || filterBy || '',
      blockchain: blockchain || savedBlockchain || '',
      rawInput: rawInput || rawQuery || ''
    };

    setData(data);

    return {
      ...data,
      setData
    };
  }, [isTokenBalances, tokenBalance, tokenHolder, searchParams, setData]);
}
