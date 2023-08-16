import { useEffect } from 'react';
import { TokenBalance } from './TokenBalances';
import { resetCachedUserInputs } from '../hooks/useSearchInput';

export function Home() {
  useEffect(() => {
    resetCachedUserInputs();
  }, []);

  return <TokenBalance />;
}
