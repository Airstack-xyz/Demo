import { createContext, useCallback, useMemo, useState } from 'react';

export type SearchContextState = {
  address?: string;
  blockchain?: string;
  tokenType?: string;
  rawInput?: string;
};

type SearchContext = {
  tokenBalance: SearchContextState;
  tokenHolder: SearchContextState;
  setTokenBalanceData: (data: SearchContextState) => void;
  setTokenHolderData: (data: SearchContextState) => void;
};

const defaultData = {
  address: '',
  blockchain: '',
  tokenType: '',
  rawInput: ''
};

// eslint-disable-next-line
const noop = () => {};

const defaultValue: SearchContext = {
  tokenBalance: defaultData,
  tokenHolder: defaultData,
  setTokenBalanceData: noop,
  setTokenHolderData: noop
};

export const searchContext = createContext<SearchContext>(defaultValue);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [tokenBalance, _setTokenBalanceData] = useState<SearchContextState>({
    ...defaultData
  });

  const [tokenHolder, _setTokenHolderData] = useState<SearchContextState>({
    ...defaultData
  });

  const setTokenBalanceData = useCallback((data: SearchContextState) => {
    _setTokenBalanceData(prev => ({ ...prev, ...data }));
  }, []);

  const setTokenHolderData = useCallback((data: SearchContextState) => {
    _setTokenHolderData(prev => ({ ...prev, ...data }));
  }, []);

  const value = useMemo(
    () => ({
      tokenBalance,
      tokenHolder,
      setTokenBalanceData,
      setTokenHolderData
    }),
    [tokenBalance, tokenHolder, setTokenBalanceData, setTokenHolderData]
  );
  return (
    <searchContext.Provider value={value}>{children}</searchContext.Provider>
  );
}
