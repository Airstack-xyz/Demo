import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { tokenHoldersQuery } from '../queries/tokenDetails';
import { useMemo } from 'react';

export interface TokenHoldersResponse {
  TokenBalances: TokenBalances;
}

export interface TokenBalances {
  TokenBalance: TokenBalance[];
}

export interface TokenBalance {
  owner: Owner;
}

export interface Owner {
  identity: string;
}

function formatTokenHolders(data: TokenHoldersResponse) {
  if (!data) return [];
  const tokens = data?.TokenBalances?.TokenBalance || [];
  return tokens.map(token => token?.owner?.identity);
}

type Data = ReturnType<typeof formatTokenHolders>;

export function useTokenHolders(
  {
    tokenId,
    tokenAddress,
    blockchain,
    limit = 200
  }: {
    tokenId: string;
    tokenAddress: string;
    blockchain: string;
    limit?: number;
  },
  onFormatData?: (data: Data) => void
) {
  const [fetchHolders, responseObject] = useLazyQueryWithPagination(
    tokenHoldersQuery,
    {
      tokenId,
      tokenAddress,
      blockchain,
      limit
    },
    {
      dataFormatter: (data: TokenHoldersResponse) => {
        return onFormatData
          ? onFormatData(formatTokenHolders(data))
          : formatTokenHolders(data);
      }
    }
  );

  return useMemo(() => {
    return {
      fetchHolders,
      ...responseObject,
      data: responseObject.data as null | Data
    };
  }, [fetchHolders, responseObject]);
}
