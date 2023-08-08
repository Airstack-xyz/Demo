import {
  SetURLSearchParams,
  useMatch,
  useSearchParams
} from 'react-router-dom';
import { useCallback, useMemo } from 'react';

export type CachedQuery = {
  address: string[];
  tokenType: string;
  rawInput: string;
  inputType: 'POAP' | 'ADDRESS' | null;
  tokenFilters: string[];
  activeView: string;
  activeViewToken: string;
  activeViewCount: string;
  blockchainType: string[];
  sortOrder: string;
};

export type UserInputs = CachedQuery;

export const userInputCache = {
  tokenBalance: {} as UserInputs,
  tokenHolder: {} as UserInputs
};

type UpdateUserInputs = (
  data: Partial<UserInputs>,
  config?: { reset?: boolean; updateQueryParams?: boolean }
) => void;

const arrayTypes = ['address', 'blockchainType', 'tokenFilters'];

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

  const [searchParams, setSarchParams] = useSearchParams();

  const setData: UpdateUserInputs = useCallback(
    (data: Partial<CachedQuery>, config) => {
      let inputs = data;
      const shouldReplaceFilters =
        data?.tokenFilters &&
        userInputCache.tokenHolder?.tokenFilters?.length > 0;

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
          } else if (arrayTypes.includes(key)) {
            // eslint-disable-next-line
            // @ts-ignore
            searchParams[key] = (inputs[key] as string[]).join(',');
          }
        }
        setSarchParams(searchParams as Record<string, string>, {
          replace: shouldReplaceFilters
        });
      }
    },
    [isTokenBalances, setSarchParams]
  );

  const getData = useCallback(
    <T extends true | false | undefined = false>(
      key: keyof CachedQuery,
      isArray?: T
    ): T extends true ? string[] : string => {
      const { tokenBalance, tokenHolder } = userInputCache;
      const valueString = searchParams.get(key) || '';
      const savedValue =
        (isTokenBalances ? tokenBalance[key] : tokenHolder[key]) ||
        (isArray ? [] : '');

      let value = isArray
        ? valueString
          ? valueString.split(',')
          : savedValue || []
        : valueString;

      if (
        isArray &&
        Array.isArray(savedValue) &&
        savedValue.join(',') === valueString
      ) {
        // if filters are same as saved filters, use refrerence of saved filters so the component doesn't re-render unnecessarily
        value = savedValue;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return value as any;
    },
    [isTokenBalances, searchParams]
  );

  return useMemo(() => {
    const data = {
      address: getData('address', true),
      tokenType: getData('tokenType'),
      rawInput: getData('rawInput'),
      inputType: !isTokenBalances
        ? (getData('inputType') as CachedQuery['inputType'])
        : null,
      activeView: isTokenBalances ? '' : getData('activeView'),
      tokenFilters: !isTokenBalances ? getData('tokenFilters', true) : [],
      activeViewToken: isTokenBalances ? '' : getData('activeViewToken'),
      activeViewCount: isTokenBalances ? '' : getData('activeViewCount'),
      blockchainType: getData('blockchainType', true),
      sortOrder: getData('sortOrder')
    };

    setData(data);

    return [data, setData, setSarchParams];
  }, [getData, isTokenBalances, setData, setSarchParams]);
}
