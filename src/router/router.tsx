import { Router as ReachRouter, RouteComponentProps } from '@reach/router';
import TokenList from '../pages/token-list';

// eslint-disable-next-line
const Home = (_: RouteComponentProps) => <TokenList />;

export function Router() {
  return (
    <ReachRouter>
      <Home path="/" />
    </ReachRouter>
  );
}
