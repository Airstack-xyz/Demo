/* eslint-disable @typescript-eslint/no-unused-vars */
import { Home as HomePage } from '../pages/home';
import { TokenBalance } from '../pages/TokenBalances';
import { TokenHolders } from '../pages/TokenHolders';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
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
