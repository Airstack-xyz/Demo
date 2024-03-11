import { TokenBalance } from './TokenBalances';
import { resetCachedUserInputs } from '../hooks/useSearchInput';

export function Home() {
  resetCachedUserInputs();

  return <TokenBalance />;
}
