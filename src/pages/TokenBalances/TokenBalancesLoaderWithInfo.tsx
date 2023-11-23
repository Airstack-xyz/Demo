import { useEffect, useState } from 'react';
import { StatusLoader } from '../../Components/StatusLoader';
import { subscribe } from '../../utils/eventEmitter/eventEmitter';
import { useSearchInput } from '../../hooks/useSearchInput';

type LoaderData = {
  matched: number;
  total: number;
  spam: number;
  loading: boolean;
};

export function TokenBalancesLoaderWithInfo() {
  const [{ address, spamFilter }] = useSearchInput();
  const [tokensData, setTokensData] = useState<LoaderData>({
    total: 0,
    matched: 0,
    spam: 0,
    loading: false
  });
  const [ERC20Data, setERC20Data] = useState<LoaderData>({
    total: 0,
    matched: 0,
    spam: 0,
    loading: false
  });

  const isSpamFilteringEnabled = spamFilter !== '0';

  const noLoader = address.length === 1 && !isSpamFilteringEnabled;

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

  if (noLoader || (!tokensData.loading && !ERC20Data.loading)) return null;

  const totalSpam = isSpamFilteringEnabled
    ? tokensData.spam + ERC20Data.spam
    : undefined;

  const totalMatching = tokensData.matched + ERC20Data.matched;

  const totalCount = tokensData.total + ERC20Data.total;

  return (
    <StatusLoader
      total={totalCount}
      spam={totalSpam}
      matching={totalMatching}
      totalSuffix="balances"
      spamSuffix="spam tokens"
      matchingSuffix="relevant balances"
    />
  );
}
