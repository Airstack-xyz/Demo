import { useMatch, useSearchParams } from 'react-router-dom';
import { useSearchData } from './useSearchData';
import { useMemo } from 'react';

export function useSearchInput() {
  let isTokenBalances = !!useMatch('/token-balances');
  const isHome = useMatch('/');

  if (isHome) {
    isTokenBalances = true;
  }
  const { tokenBalance, tokenHolder, setTokenBalanceData, setTokenHolderData } =
    useSearchData();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('address') || '';
  const tokenType = searchParams.get('filterBy') || '';
  const blockchain = searchParams.get('blockchain') || '';
  const rawInput = searchParams.get('rawInput') || '';

  const setData = useMemo(
    () => (isTokenBalances ? setTokenBalanceData : setTokenHolderData),
    [isTokenBalances, setTokenBalanceData, setTokenHolderData]
  );

  return useMemo(() => {
    const {
      rawInput: rawQuery,
      address,
      blockchain: savedBlockchain,
      filterBy
    } = isTokenBalances ? tokenBalance : tokenHolder;

    return {
      address: query || address || '',
      filterBy: tokenType || filterBy || '',
      blockchain: blockchain || savedBlockchain || '',
      rawInput: rawInput || rawQuery || '',
      setData
    };
  }, [
    isTokenBalances,
    tokenBalance,
    tokenHolder,
    query,
    tokenType,
    blockchain,
    rawInput,
    setData
  ]);
}
