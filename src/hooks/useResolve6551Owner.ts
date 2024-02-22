import { fetchQuery } from '@airstack/airstack-react';
import { useCallback, useState } from 'react';
import { Resolve6551OwnerQuery } from '../queries/resolve6551OwnerQuery';

type Resolve6551OwnerResponse = {
  Accounts: {
    Account: Account[];
  };
};

type Account = {
  nft: {
    address: string;
    tokenId: string;
    tokenBalances: {
      owner: {
        identity: string;
        accounts: Account[];
      };
    }[];
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

type Resolve6551OwnerParamsType = {
  address: string;
  blockchain: string;
  maxDepth?: number;
};

type TraverseDataType = {
  ownerAddress: string | null;
  hasParent: boolean | null;
};

export const resolve6551Owner = async ({
  address,
  blockchain,
  maxDepth = 3
}: Resolve6551OwnerParamsType): Promise<{
  data: TraverseDataType | null;
  error: unknown;
}> => {
  const { data, error } = await fetchQuery<Resolve6551OwnerResponse>(
    Resolve6551OwnerQuery,
    {
      address,
      blockchain
    }
  );

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
    return { data: dataToReturn, error: null };
  }

  if (maxDepth >= ownerData.depth && ownerData.lastAddress) {
    const nestedTraverseData = await resolve6551Owner({
      address: ownerData.lastAddress,
      blockchain,
      maxDepth: maxDepth - ownerData.depth
    });
    if (nestedTraverseData.data || nestedTraverseData.error) {
      return nestedTraverseData;
    }
  }

  return { data: null, error: null };
};

export function useResolve6551Owner() {
  const [status, setStatus] = useState<string>('idle');
  const [data, setData] = useState<TraverseDataType | null>(null);

  const fetchResolvedOwner = useCallback(
    async (params: Resolve6551OwnerParamsType) => {
      setStatus('loading');
      setData(null);

      const { data, error } = await resolve6551Owner(params);
      if (error) {
        setStatus('error');
      }
      if (data) {
        setStatus('idle');
        setData(data);
      }
      return { data, error };
    },
    []
  );

  return {
    fetchResolvedOwner,
    data,
    loading: status === 'loading',
    error: status === 'error'
  };
}
