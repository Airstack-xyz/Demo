import { Home } from '../pages/home';
import { TokenBalance } from '../pages/TokenBalances';
import { TokenHolders } from '../pages/TokenHolders';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/token-balances',
    element: <TokenBalance />
  },
  {
    path: '/token-holders',
    element: <TokenHolders />
  }
]);

export function Router() {
  return <RouterProvider router={router} />;
}
