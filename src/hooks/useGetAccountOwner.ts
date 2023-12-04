import { useLazyQuery } from '@airstack/airstack-react';
import { tokenBlockchains } from '../constants';
import { accountOwnerQuery } from '../queries/accountsQuery';
import { TokenBlockchain } from '../types';

export type AccountOwnerResponse = {
  [Key in TokenBlockchain]: {
    Account: Account[];
  };
};

export type AccountOwnerVariables = {
  accountAddress: string;
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

function formatData(data: AccountOwnerResponse) {
  if (!data) return null;
  const tokenAccounts: Account[] = [];

  tokenBlockchains.forEach(blockchain => {
    const accounts = data?.[blockchain]?.Account || [];
    tokenAccounts.push(...accounts);
  });

  const account = tokenAccounts.find(account => account.tokenAddress);
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
  const [fetch, { data, loading }] = useLazyQuery<
    AccountOwner,
    AccountOwnerVariables
  >(
    accountOwnerQuery,
    {
      accountAddress
    },
    { dataFormatter: formatData, onCompleted, onError }
  );

  return [fetch, data, loading] as const;
}
