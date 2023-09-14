import { config } from '@airstack/airstack-react/config';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createNftWithCommonOwnersQuery } from '../queries/nftWithCommonOwnersQuery';
import { UserInputs } from './useSearchInput';
import { defaultSortOrder } from '../pages/TokenBalances/SortBy';
import { tokenTypes } from '../pages/TokenBalances/constants';
import { CommonTokenType, TokenType } from '../pages/TokenBalances/types';
import { useLazyQueryWithPagination } from '@airstack/airstack-react';

const LIMIT = 20;
const LIMIT_COMBINATIONS = 100;

type Inputs = Pick<
  UserInputs,
  'address' | 'tokenType' | 'blockchainType' | 'sortOrder'
> & {
  includeERC20?: boolean;
};
export function useGetTokensOfOwner(
  inputs: Inputs,
  onDataReceived: (tokens: TokenType[]) => void
) {
  const {
    address: owners,
    tokenType: tokenType = '',
    blockchainType,
    sortOrder,
    includeERC20
  } = inputs;
  const visitedTokensSetRef = useRef<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [processedTokensCount, setProcessedTokensCount] = useState(LIMIT);
  const tokensRef = useRef<TokenType[]>([]);
  const fetchAllBlockchains =
    blockchainType.length === 2 || blockchainType.length === 0;

  const query = useMemo(() => {
    return createNftWithCommonOwnersQuery(
      owners,
      fetchAllBlockchains ? null : blockchainType[0]
    );
  }, [blockchainType, fetchAllBlockchains, owners]);

  const isPoap = tokenType === 'POAP';
  const [
    fetchTokens,
    {
      data: tokensData,
      pagination: { getNextPage, hasNextPage }
    }
  ] = useLazyQueryWithPagination(query, {}, config);

  useEffect(() => {
    if (owners.length === 0) return;

    if (!tokenType || !isPoap) {
      setLoading(true);
      visitedTokensSetRef.current = new Set();
      tokensRef.current = [];
      fetchTokens({
        limit: owners.length > 1 ? LIMIT_COMBINATIONS : LIMIT,
        sortBy: sortOrder ? sortOrder : defaultSortOrder,
        tokenType:
          tokenType && tokenType.length > 0
            ? [tokenType]
            : tokenTypes.filter(
                tokenType =>
                  tokenType !== 'POAP' &&
                  (includeERC20 ? true : tokenType !== 'ERC20')
              )
      });
    }

    setProcessedTokensCount(LIMIT);
  }, [
    blockchainType,
    fetchTokens,
    includeERC20,
    isPoap,
    owners,
    sortOrder,
    tokenType
  ]);

  useEffect(() => {
    if (!tokensData) return;
    const { ethereum, polygon } = tokensData;
    let ethTokens = ethereum?.TokenBalance || [];
    let maticTokens = polygon?.TokenBalance || [];
    const processedTokenCount = ethTokens.length + maticTokens.length;
    setProcessedTokensCount(count => count + processedTokenCount);

    if (ethTokens.length > 0 && ethTokens[0]?.token?.tokenBalances) {
      ethTokens = ethTokens
        .filter((token: CommonTokenType) =>
          Boolean(token?.token?.tokenBalances?.length)
        )
        .map((token: CommonTokenType) => {
          token._common_tokens = token.token.tokenBalances || null;
          return token;
        }, []);
    }
    if (maticTokens.length > 0 && maticTokens[0]?.token?.tokenBalances) {
      maticTokens = maticTokens
        .filter((token: CommonTokenType) =>
          Boolean(token?.token?.tokenBalances?.length)
        )
        .map((token: CommonTokenType) => {
          token._common_tokens = token.token.tokenBalances || null;
          return token;
        }, []);
    }
    const tokens = [...ethTokens, ...maticTokens];
    tokensRef.current = [...tokensRef.current, ...tokens];
    onDataReceived(tokens);

    if (hasNextPage && tokensRef.current.length < LIMIT) {
      setLoading(true);
      getNextPage();
      return;
    }
    setLoading(false);
    tokensRef.current = [];
  }, [getNextPage, hasNextPage, onDataReceived, tokensData]);

  const getNext = useCallback(() => {
    if (!hasNextPage) return;
    setLoading(true);
    tokensRef.current = [];
    getNextPage();
  }, [getNextPage, hasNextPage]);

  return useMemo(() => {
    return {
      loading,
      hasNextPage,
      processedTokensCount,
      getNext
    };
  }, [loading, hasNextPage, processedTokensCount, getNext]);
}
