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

const LOADER_HIDE_DELAY = 1000;

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

  const [isLoaderVisible, setIsLoaderVisible] = useState(false);

  const isSpamFilteringEnabled = spamFilter !== '0';

  const noLoader = address.length === 1 && !isSpamFilteringEnabled;

  const showLoader = tokensData.loading || ERC20Data.loading;

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (showLoader) {
      setIsLoaderVisible(true);
    } else {
      // Need to hide loader after some delay, so that last count info be displayed
      timerId = setTimeout(() => setIsLoaderVisible(false), LOADER_HIDE_DELAY);
    }
    return () => {
      clearTimeout(timerId);
    };
  }, [showLoader]);

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

  if (noLoader || !isLoaderVisible) return null;

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
