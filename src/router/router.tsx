/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router as ReachRouter, RouteComponentProps } from '@reach/router';
import { Home as HomePage } from '../pages/home';
import { TokenBalance as TokenBalancePage } from '../pages/TokenBalances';
import { TokenHolders as TokenHoldersPage } from '../pages/TokenHolders';

const Home = (_: RouteComponentProps) => <HomePage />;
const TokenBalance = (_: RouteComponentProps) => <TokenBalancePage />;
const TokenHolders = (_: RouteComponentProps) => <TokenHoldersPage />;

export function Router() {
  return (
    <ReachRouter>
      <Home path="/" />
      <TokenBalance path="/token-balances" />
      <TokenHolders path="/token-holders" />
    </ReachRouter>
  );
}
