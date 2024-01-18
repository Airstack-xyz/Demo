import { useEffect, useState } from 'react';
import { StatusLoader } from '../../Components/StatusLoader';
import { subscribe } from '../../utils/eventEmitter/eventEmitter';
import { useSearchInput } from '../../hooks/useSearchInput';

type LoaderData = {
  matched: number;
  total: number;
  loading: boolean;
};

// Show some default total count instead of zero, so that in loader 'Scanning 0 records' is not shown
const DEFAULT_TOTAL_COUNT = 10;
const COMBINATION_DEFAULT_TOTAL_COUNT = 1;

const LOADER_HIDE_DELAY = 1000;

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

  const [isLoaderVisible, setIsLoaderVisible] = useState(false);

  const noLoader = address.length < 2;

  const isCombination = address.length > 1;

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

  const totalMatching = tokensData.matched + ERC20Data.matched;
  const totalCount =
    tokensData.total + ERC20Data.total ||
    (isCombination ? COMBINATION_DEFAULT_TOTAL_COUNT : DEFAULT_TOTAL_COUNT);

  return (
    <StatusLoader
      lines={[
        [`Scanning %n records`, totalCount],
        [`Found %n matching results`, totalMatching]
      ]}
    />
  );
}
