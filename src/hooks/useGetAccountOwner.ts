import { useLazyQuery } from '@airstack/airstack-react';
import { accountOwnerQuery } from '../queries/accountsQuery';
import { TokenBlockchain } from '../types';

export type AccountsRequestData = {
  [Key in TokenBlockchain]: {
    Account: Account[];
  };
};

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
  const { ethereum, polygon, base } = data;
  const accounts = [
    ...(ethereum?.Account || []),
    ...(polygon?.Account || []),
    ...(base?.Account || [])
  ];
  const account = accounts.find(account => account.tokenAddress);
  return account
    ? {
        ...account,
        token: account?.nft?.tokenBalances[0]
      }
    : null;
}
export type AccountOwner = ReturnType<typeof formatData>;

export function useGetAccountOwner(
  accountAddress: string,
  onCompleted?: (data: AccountOwner) => void,
  onError?: () => void
) {
  const [fetch, { data, loading }] = useLazyQuery(
    accountOwnerQuery,
    {
      accountAddress
    },
    { dataFormatter: formatData, onCompleted, onError }
  );

  return [fetch, data as AccountOwner, loading] as const;
}
