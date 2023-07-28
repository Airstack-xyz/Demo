import {
  SetURLSearchParams,
  useMatch,
  useSearchParams
} from 'react-router-dom';
import { useCallback, useMemo } from 'react';

export type cachedQuery = {
  address: string;
  blockchain: string;
  tokenType: string;
  rawInput: string;
  inputType: 'POAP' | 'ADDRESS' | null;
  tokenFilters: string[];
  activeView: string;
  activeViewToken: string;
  activeViewCount: string;
};

export type UserInputs = cachedQuery;

export const userInputCache = {
  tokenBalance: {} as UserInputs,
  tokenHolder: {} as UserInputs
};

type UpdateUserInputs = (
  data: Partial<UserInputs>,
  config?: { reset?: boolean; updateQueryParams?: boolean }
) => void;

export function useSearchInput(): [
  UserInputs,
  UpdateUserInputs,
  SetURLSearchParams
] {
  let isTokenBalances = !!useMatch('/token-balances');
  const isHome = useMatch('/');

  if (isHome) {
    isTokenBalances = true;
  }
  const { tokenBalance, tokenHolder } = userInputCache;
  const [searchParams, setSarchParams] = useSearchParams();

  const setData: UpdateUserInputs = useCallback(
    (data: Partial<cachedQuery>, config) => {
      let inputs = data;
      if (isTokenBalances) {
        inputs = {
          ...(config?.reset ? {} : userInputCache.tokenBalance),
          ...data
        };
        userInputCache.tokenBalance = inputs as UserInputs;
      } else {
        inputs = {
          ...(config?.reset ? {} : userInputCache.tokenHolder),
          ...data
        };
        userInputCache.tokenHolder = inputs as UserInputs;
      }

      if (config?.updateQueryParams) {
        const searchParams = { ...inputs };
        for (const key in inputs) {
          if (!searchParams[key as keyof typeof searchParams]) {
            // eslint-disable-next-line
            // @ts-ignore
            searchParams[key] = '';
          } else if (key === 'tokenFilters') {
            // eslint-disable-next-line
            // @ts-ignore
            searchParams[key] = (inputs[key] as string[]).join(',');
          }
        }
        setSarchParams(searchParams as Record<string, string>);
      }
    },
    [isTokenBalances, setSarchParams]
  );

  return useMemo(() => {
    const {
      rawInput: rawQuery,
      address,
      blockchain: savedBlockchain,
      tokenType: savedTokenType,
      inputType: savedInputType,
      tokenFilters: savedTokenFilters
    } = isTokenBalances ? tokenBalance : tokenHolder;

    const query = searchParams.get('address') || '';
    const tokenType = searchParams.get('tokenType') || '';
    const blockchain = searchParams.get('blockchain') || '';
    const rawInput = searchParams.get('rawInput') || '';
    const activeView = searchParams.get('activeView') || '';
    const activeViewToken = searchParams.get('activeViewToken') || '';
    const activeViewCount = searchParams.get('activeViewCount') || '';
    const inputType =
      (searchParams.get('inputType') as UserInputs['inputType']) || null;

    const filtersString = searchParams.get('tokenFilters') || '';
    let tokenFilters = filtersString ? filtersString.split(',') : [];

    if ((savedTokenFilters || []).join(',') === filtersString) {
      // if filters are same as saved filters, use refrerence of saved filters so the component doesn't re-render unnecessarily
      tokenFilters = savedTokenFilters;
    }

    const data = {
      address: query || address || '',
      tokenType: tokenType || savedTokenType || '',
      blockchain: blockchain || savedBlockchain || '',
      rawInput: rawInput || rawQuery || '',
      inputType: !isTokenBalances ? inputType || savedInputType : null,
      activeView: isTokenBalances ? '' : activeView,
      tokenFilters: !isTokenBalances ? tokenFilters : [],
      activeViewToken: isTokenBalances ? '' : activeViewToken,
      activeViewCount: isTokenBalances ? '' : activeViewCount
    };

    setData(data);

    return [data, setData, setSarchParams];
  }, [
    isTokenBalances,
    tokenBalance,
    tokenHolder,
    searchParams,
    setData,
    setSarchParams
  ]);
}
