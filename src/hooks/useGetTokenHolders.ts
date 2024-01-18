import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { tokenHoldersQuery } from '../queries/tokenDetails';
import { useMemo } from 'react';

type TokenHoldersResponse = {
  TokenBalances: {
    TokenBalance: TokenBalance[];
  };
};

type TokenHoldersVariables = {
  tokenId: string;
  tokenAddress: string;
  blockchain: string;
  limit?: number;
};

type TokenBalance = {
  owner: {
    identity: string;
  };
};

function formatTokenHolders(data: TokenHoldersResponse) {
  if (!data) return [];
  const tokens = data?.TokenBalances?.TokenBalance || [];
  return tokens.map(token => token?.owner?.identity);
}

type TokenHoldersData = ReturnType<typeof formatTokenHolders>;

export function useGetTokenHolders(
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
  onFormatData?: (data: TokenHoldersData) => string[]
) {
  const [fetchTokenHolders, hookResponseData] = useLazyQueryWithPagination<
    TokenHoldersResponse,
    TokenHoldersVariables
  >(
    tokenHoldersQuery,
    {
      tokenId,
      tokenAddress,
      blockchain,
      limit
    },
    {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore-next-line
      dataFormatter: (data: TokenHoldersResponse) => {
        return onFormatData
          ? onFormatData(formatTokenHolders(data))
          : formatTokenHolders(data);
      }
    }
  );

  return useMemo(() => {
    return {
      fetchHolders: fetchTokenHolders,
      ...hookResponseData,
      data: hookResponseData.data as null | TokenHoldersData
    };
  }, [fetchTokenHolders, hookResponseData]);
}
