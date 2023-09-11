import {
  SetURLSearchParams,
  createSearchParams,
  useMatch,
  useNavigate,
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
  activeTokenInfo: string;
  sortOrder: string;
  snapshotDate: string | undefined; // Format: YYYY-MM-DD
  snapshotBlockNumber: number | undefined;
  snapshotTimestamp: number | undefined;
};

export type UserInputs = CachedQuery;

export const userInputCache = {
  tokenBalance: {} as UserInputs,
  tokenHolder: {} as UserInputs
};

type UpdateUserInputs = (
  data: Partial<UserInputs>,
  config?: { reset?: boolean; updateQueryParams?: boolean; redirectTo?: string }
) => void;

const arrayTypes = ['address', 'blockchainType', 'tokenFilters'];

export function resetCachedUserInputs() {
  userInputCache.tokenBalance = {} as UserInputs;
  userInputCache.tokenHolder = {} as UserInputs;
}

export function useSearchInput(
  isTokenBalancesPage?: boolean
): [UserInputs, UpdateUserInputs, SetURLSearchParams] {
  let isTokenBalances = !!useMatch('/token-balances');
  const isHome = useMatch('/');
  const navigate = useNavigate();

  if (isHome) {
    isTokenBalances =
      isTokenBalancesPage !== undefined ? isTokenBalancesPage : true;
  }

  const [searchParams, setSearchParams] = useSearchParams();

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
        if (config.redirectTo) {
          navigate({
            pathname: config.redirectTo,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            search: createSearchParams(searchParams as any).toString()
          });
          return;
        }
        setSearchParams(searchParams as Record<string, string>, {
          replace: shouldReplaceFilters
        });
      }
    },
    [isTokenBalances, navigate, setSearchParams]
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
        : valueString || savedValue;

      if (
        isArray &&
        Array.isArray(savedValue) &&
        savedValue.join(',') === valueString
      ) {
        // if filters are same as saved filters, use reference of saved filters so the component doesn't re-render unnecessarily
        value = savedValue;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return value as any;
    },
    [isTokenBalances, searchParams]
  );

  return useMemo(() => {
    const _snapshotDate = searchParams.get('snapshotDate');
    const _snapshotBlockNumber = searchParams.get('snapshotBlockNumber');
    const _snapshotTimestamp = searchParams.get('snapshotTimestamp');

    const data = {
      address: getData('address', true),
      tokenType: getData('tokenType'),
      rawInput: getData('rawInput'),
      inputType: !isTokenBalances
        ? (getData('inputType') as CachedQuery['inputType'])
        : null,
      activeView: isTokenBalances ? '' : searchParams.get('activeView') || '',
      activeTokenInfo: searchParams.get('activeTokenInfo') || '',
      tokenFilters: !isTokenBalances ? getData('tokenFilters', true) : [],
      activeViewToken: isTokenBalances ? '' : getData('activeViewToken'),
      activeViewCount: isTokenBalances ? '' : getData('activeViewCount'),
      blockchainType: getData('blockchainType', true),
      sortOrder: getData('sortOrder'),
      snapshotDate: _snapshotDate || undefined,
      snapshotBlockNumber: _snapshotBlockNumber
        ? Number(_snapshotBlockNumber)
        : undefined,
      snapshotTimestamp: _snapshotTimestamp
        ? Number(_snapshotTimestamp)
        : undefined
    };

    setData(data);

    return [data, setData, setSearchParams];
  }, [isTokenBalances, searchParams, getData, setData, setSearchParams]);
}
