import { useLazyQuery } from '@airstack/airstack-react';
import { accountOwnerQuery } from '../queries/accountsQuery';

export interface AccountsRequestData {
  ethereum: {
    Account: Account[];
  };
  polygon: {
    Account: Account[];
  };
}

export interface Account {
  tokenId: string;
  blockchain: string;
  tokenAddress: string;
  nft: {
    tokenBalances: TokenBalance[];
  };
}

export interface TokenBalance {
  tokenId: string;
  tokenAddress: string;
  blockchain: string;
  owner: {
    identity: string;
  };
}

function formatData(data: AccountsRequestData) {
  if (!data) return null;
  const { ethereum, polygon } = data;
  const accounts = [...(ethereum?.Account || []), ...(polygon?.Account || [])];
  const account = accounts.find(account => account.tokenAddress);
  return account
    ? {
        ...account,
        token: account?.nft?.tokenBalances[0]
      }
    : null;
}

export function useGetAccountOwner(accountAddress: string) {
  const [fetch, { data, loading }] = useLazyQuery(
    accountOwnerQuery,
    {
      accountAddress
    },
    { dataFormatter: formatData }
  );

  return [fetch, data as ReturnType<typeof formatData>, loading] as const;
}
