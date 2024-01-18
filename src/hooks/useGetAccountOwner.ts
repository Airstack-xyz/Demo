import { useLazyQuery } from '@airstack/airstack-react';
import { tokenBlockchains } from '../constants';
import { accountOwnerQuery } from '../queries/accountsQuery';
import { TokenBlockchain } from '../types';

type AccountOwnerResponse = {
  [Key in TokenBlockchain]: {
    Account: Account[];
  };
};

type AccountOwnerVariables = {
  accountAddress: string;
};

type Account = {
  tokenId: string;
  blockchain: string;
  tokenAddress: string;
  nft: {
    tokenBalances: {
      tokenId: string;
      tokenAddress: string;
      blockchain: string;
      owner: {
        identity: string;
      };
    }[];
  };
};

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

export type AccountOwnerData = ReturnType<typeof formatData>;

export function useGetAccountOwner(
  accountAddress: string,
  onCompleted?: (data: AccountOwnerData) => void,
  onError?: () => void
) {
  const [fetch, { data, loading }] = useLazyQuery<
    AccountOwnerData,
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
