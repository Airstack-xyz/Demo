import { Router as ReachRouter, RouteComponentProps } from '@reach/router';
import TokenList from '../pages/token-list';

const Home = (_: RouteComponentProps) => <TokenList />;

export function Router() {
  return (
    <ReachRouter>
      <Home path="/" />
    </ReachRouter>
  );
}
