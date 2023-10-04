import { useEffect, useState } from 'react';
import { StatusLoader } from '../../Components/StatusLoader';
import { subscribe } from '../../utils/eventEmitter/eventEmitter';
import { useSearchInput } from '../../hooks/useSearchInput';

export function TokenBalancesLoaderWithInfo() {
  const [{ address }] = useSearchInput();
  const [tokensData, setTokensData] = useState({
    total: 0,
    matched: 0,
    loading: false
  });
  const [ERC20Data, setERC20Data] = useState({
    total: 0,
    matched: 0,
    loading: false
  });

  const noLoader = address.length < 2;

  useEffect(() => {
    if (noLoader) return;

    const unsubscribeTokens = subscribe(
      'token-balances:tokens',
      ({
        matched,
        total,
        loading
      }: {
        matched: number;
        total: number;
        loading: boolean;
      }) => {
        setTokensData({ matched, total, loading });
      }
    );
    const unsubscribeERC20 = subscribe(
      'token-balances:ERC20',
      ({
        matched,
        total,
        loading
      }: {
        matched: number;
        total: number;
        loading: boolean;
      }) => {
        setERC20Data({ matched, total, loading });
      }
    );
    return () => {
      unsubscribeTokens();
      unsubscribeERC20();
    };
  }, [address.length, noLoader]);

  if (noLoader || (!tokensData.loading && !ERC20Data.loading)) return null;

  return (
    <StatusLoader
      matching={tokensData.matched + ERC20Data.matched}
      total={tokensData.total + ERC20Data.total}
    />
  );
}
