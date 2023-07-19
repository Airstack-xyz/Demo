import { useMatch, useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

export type cachedQuery = {
  address?: string;
  blockchain?: string;
  tokenType?: string;
  rawInput?: string;
  inputType?: 'POAP' | 'ADDRESS' | null;
};

export type UserInputs = cachedQuery;

export const userInputCache = {
  tokenBalance: {} as UserInputs,
  tokenHolder: {} as UserInputs
};

export function useSearchInput() {
  let isTokenBalances = !!useMatch('/token-balances');
  const isHome = useMatch('/');

  if (isHome) {
    isTokenBalances = true;
  }
  const { tokenBalance, tokenHolder } = userInputCache;
  const [searchParams] = useSearchParams();

  const setData = useCallback(
    (data: cachedQuery) => {
      if (isTokenBalances) {
        userInputCache.tokenBalance = {
          ...userInputCache.tokenBalance,
          ...data
        };
      } else {
        userInputCache.tokenHolder = { ...userInputCache.tokenHolder, ...data };
      }
    },
    [isTokenBalances]
  );

  return useMemo(() => {
    const {
      rawInput: rawQuery,
      address,
      blockchain: savedBlockchain,
      tokenType: savedTokenType,
      inputType: savedInputType
    } = isTokenBalances ? tokenBalance : tokenHolder;

    const query = searchParams.get('address') || '';
    const tokenType = searchParams.get('tokenType') || '';
    const blockchain = searchParams.get('blockchain') || '';
    const rawInput = searchParams.get('rawInput') || '';
    const inputType =
      (searchParams.get('inputType') as UserInputs['inputType']) || null;

    const data = {
      address: query || address || '',
      tokenType: tokenType || savedTokenType || '',
      blockchain: blockchain || savedBlockchain || '',
      rawInput: rawInput || rawQuery || '',
      inputType: !isTokenBalances ? inputType || savedInputType : null
    };

    setData(data);

    return {
      ...data,
      setData
    };
  }, [isTokenBalances, tokenBalance, tokenHolder, searchParams, setData]);
}
