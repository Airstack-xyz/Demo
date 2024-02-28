import { Layout } from '../Components/Layout';
import { Home } from '../pages/home';
import { OnChainGraphPage } from '../pages/OnchainGraph';
import PaymentSuccess from '../pages/PaymentSuccess';
import { TokenBalance } from '../pages/TokenBalances';
import { TokenHolders } from '../pages/TokenHolders';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
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
      },
      {
        path: '/onchain-graph', // identity: string, ref: string
        element: <OnChainGraphPage />
      }
    ]
  },
  {
    path: '/payment-success',
    element: <PaymentSuccess />
  }
]);

export function Router() {
  return <RouterProvider router={router} />;
}
