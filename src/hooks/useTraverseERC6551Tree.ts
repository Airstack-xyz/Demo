import { fetchQuery } from '@airstack/airstack-react';
import { useCallback, useState } from 'react';
import {
  AccountTraverseQuery,
  WalletQuery
} from '../queries/traverse6551TreeQuery';

type Account = {
  nft: {
    address: string;
    tokenId: string;
    tokenBalances: AccountTokenBalance[];
  };
};

type AccountTokenBalance = {
  owner: {
    identity: string;
    accounts: Account[];
  };
};

function getOwnerData({
  accounts,
  lastAddress,
  depth = 1
}: {
  accounts: Account[] | undefined;
  lastAddress?: string | null;
  depth?: number;
}): {
  address: string | null;
  lastAddress?: string | null;
  depth: number;
} {
  if (!accounts || accounts.length === 0) {
    return {
      address: null,
      lastAddress,
      depth
    };
  }

  for (const account of accounts) {
    const tokenBalances = account?.nft?.tokenBalances;
    if (tokenBalances && tokenBalances.length > 0) {
      for (const token of tokenBalances) {
        const ownerAccounts = token?.owner?.accounts;
        const ownerAddress = token?.owner?.identity;
        if (ownerAccounts && ownerAccounts.length === 0) {
          return {
            address: ownerAddress,
            lastAddress,
            depth
          };
        }
        const nestedOwnerData = getOwnerData({
          accounts: ownerAccounts,
          lastAddress: ownerAddress,
          depth: depth + 1
        });
        if (nestedOwnerData.address) {
          return nestedOwnerData;
        }
      }
    }
  }

  return {
    address: null,
    lastAddress,
    depth
  };
}

type TraverseERC6551TreeParamsType = {
  address: string;
  blockchain: string;
  maxDepth?: number;
  fetchWallet?: boolean;
};

type WalletDataType = {
  identity: string;
  addresses: string[];
  socials: {
    blockchain: string;
    dappName: string;
    profileName: string;
    profileHandle: string;
  };
  primaryDomain: {
    name: string;
  };
  domains: {
    name: string;
  }[];
  xmtp: {
    isXMTPEnabled: boolean;
  }[];
};

type TraverseDataType = {
  ownerAddress: string | null;
  hasParent: boolean | null;
  wallet?: WalletDataType | null;
};

export const traverseERC6551Tree = async ({
  address,
  blockchain,
  maxDepth = 3,
  fetchWallet
}: TraverseERC6551TreeParamsType): Promise<{
  data: TraverseDataType | null;
  error: unknown;
}> => {
  const { data, error } = await fetchQuery(AccountTraverseQuery, {
    address,
    blockchain
  });

  const accounts = data?.Accounts?.Account;
  if (error || !accounts) {
    return { data: null, error };
  }

  const ownerData = getOwnerData({ accounts });
  if (ownerData.address) {
    const dataToReturn: TraverseDataType = {
      ownerAddress: ownerData.address,
      hasParent: ownerData.depth > 0
    };
    if (fetchWallet) {
      const response = await fetchQuery(WalletQuery, {
        address: ownerData.address
      });
      dataToReturn.wallet = response?.data?.Wallet as WalletDataType;
    }
    return { data: dataToReturn, error: null };
  }

  if (maxDepth >= ownerData.depth && ownerData.lastAddress) {
    const nestedTraverseData = await traverseERC6551Tree({
      address: ownerData.lastAddress,
      blockchain,
      maxDepth: maxDepth - ownerData.depth,
      fetchWallet
    });
    if (nestedTraverseData.data || nestedTraverseData.error) {
      return nestedTraverseData;
    }
  }

  return { data: null, error: null };
};

export function useTraverseERC6551Tree() {
  const [data, setData] = useState<TraverseDataType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchData = useCallback(
    async (params: TraverseERC6551TreeParamsType) => {
      setLoading(false);
      const { data, error } = await traverseERC6551Tree(params);
      if (error) {
        setError(error);
      }
      if (data) {
        setData(data);
      }
      setLoading(false);
      return { data, error };
    },
    []
  );

  return [fetchData, { data, loading, error }];
}
