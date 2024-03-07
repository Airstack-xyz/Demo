import { Layout } from '../Components/Layout';
import { Channels } from '../page-views/Channels';
import { Home } from '../page-views/home';
import { OnChainGraphPage } from '../page-views/OnchainGraph';
import PaymentSuccess from '../page-views/PaymentSuccess';
import { TokenBalance } from '../page-views/TokenBalances';
import { TokenHolders } from '../page-views/TokenHolders';

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
      },
      {
        path: '/channels',
        element: <Channels />
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
