import { useEffect, useState } from 'react';
import { StatusLoader } from '../../Components/StatusLoader';
import { subscribe } from '../../utils/eventEmitter/eventEmitter';
import { useSearchInput } from '../../hooks/useSearchInput';

type LoaderData = {
  matched: number;
  total: number;
  loading: boolean;
};

export function TokenBalancesLoaderWithInfo() {
  const [{ address }] = useSearchInput();
  const [tokensData, setTokensData] = useState<LoaderData>({
    total: 0,
    matched: 0,
    loading: false
  });
  const [ERC20Data, setERC20Data] = useState<LoaderData>({
    total: 0,
    matched: 0,
    loading: false
  });

  const noLoader = address.length < 2;

  const showLoader = tokensData.loading || ERC20Data.loading;

  useEffect(() => {
    if (noLoader) return;

    const unsubscribeTokens = subscribe(
      'token-balances:tokens',
      (data: LoaderData) => {
        setTokensData(prev => ({ ...prev, ...data }));
      }
    );
    const unsubscribeERC20 = subscribe(
      'token-balances:ERC20',
      (data: LoaderData) => {
        setERC20Data(prev => ({ ...prev, ...data }));
      }
    );
    return () => {
      unsubscribeTokens();
      unsubscribeERC20();
    };
  }, [address.length, noLoader]);

  if (noLoader || !showLoader) return null;

  const totalMatching = tokensData.matched + ERC20Data.matched;
  const totalCount = tokensData.total + ERC20Data.total;

  return (
    <StatusLoader
      lines={[
        totalCount
          ? [`Scanning next 30 records (total %n)`, totalCount]
          : [`Scanning first 30 records`, 1],
        [`Found %n matching results`, totalMatching]
      ]}
    />
  );
}
