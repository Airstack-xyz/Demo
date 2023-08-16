import { useEffect } from 'react';
import { TokenBalance } from './TokenBalances';
import { useSearchInput } from '../hooks/useSearchInput';

export function Home() {
  const setData = useSearchInput()[1];
  useEffect(() => {
    // reset search params on mount
    setData({}, { reset: true });
  }, [setData]);

  return <TokenBalance />;
}
