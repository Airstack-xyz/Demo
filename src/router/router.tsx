/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router as ReachRouter, RouteComponentProps } from '@reach/router';
import { Home as HomePage } from '../pages/home';
import { TokenBalance as TokenBalancePage } from '../pages/TokenBalances';

const Home = (_: RouteComponentProps) => <HomePage />;
const TokenBalance = (_: RouteComponentProps) => <TokenBalancePage />;

export function Router() {
  return (
    <ReachRouter>
      <Home path="/" />
      <TokenBalance path="/token-balances" />
    </ReachRouter>
  );
}
