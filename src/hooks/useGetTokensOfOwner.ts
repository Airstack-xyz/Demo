import { config } from '@airstack/airstack-react/config';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createNftWithCommonOwnersQuery } from '../queries/nftWithCommonOwnersQuery';
import { useSearchInput } from './useSearchInput';
import { defaultSortOrder } from '../pages/TokenBalances/SortBy';
import { tokenTypes } from '../pages/TokenBalances/constants';
import { CommonTokenType, TokenType } from '../pages/TokenBalances/types';
import { useLazyQueryWithPagination } from '@airstack/airstack-react';

const LIMIT = 20;

export function useGetTokensOfOwner(
  onDataReceived: (tokens: TokenType[]) => void
) {
  const [loading, setLoading] = useState(false);
  const [processedTokensCount, setProcessedTokensCount] = useState(LIMIT);
  const tokensRef = useRef<TokenType[]>([]);
  const [
    { address: owners, tokenType: tokenType = '', blockchainType, sortOrder }
  ] = useSearchInput();
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

    // // const hasPolygonChainFilter =
    //   blockchainType.length === 1 && blockchainType[0] === 'polygon';

    if (!tokenType || !isPoap) {
      setLoading(true);
      fetchTokens({
        limit: LIMIT,
        sortBy: sortOrder ? sortOrder : defaultSortOrder,
        tokenType:
          tokenType && tokenType.length > 0
            ? [tokenType]
            : tokenTypes.filter(tokenType => tokenType !== 'POAP')
      });
    }
    tokensRef.current = [];
    setProcessedTokensCount(LIMIT);
  }, [
    blockchainType,
    fetchTokens,
    isPoap,
    owners.length,
    sortOrder,
    tokenType
  ]);

  useEffect(() => {
    if (!tokensData) return;
    const { ethereum, polygon } = tokensData;
    let ethTokens = ethereum?.TokenBalance || [];
    let maticTokens = polygon?.TokenBalance || [];

    if (ethTokens.length > 0 && ethTokens[0]?.token?.tokenBalances) {
      ethTokens = ethTokens
        .filter((token: CommonTokenType) =>
          Boolean(token?.token?.tokenBalances?.length)
        )
        .reduce((items: TokenType[], token: CommonTokenType) => {
          items.push(token.token.tokenBalances[0]);
          return items;
        }, []);
    }
    if (maticTokens.length > 0 && maticTokens[0]?.token?.tokenBalances) {
      maticTokens = maticTokens
        .filter((token: CommonTokenType) =>
          Boolean(token?.token?.tokenBalances?.length)
        )
        .reduce((items: TokenType[], token: CommonTokenType) => {
          items.push(token.token.tokenBalances[0]);
          return items;
        }, []);
    }
    tokensRef.current = [...tokensRef.current, ...ethTokens, ...maticTokens];
    setProcessedTokensCount(
      count => count + (ethTokens.length + maticTokens.length)
    );
    onDataReceived([...ethTokens, ...maticTokens]);

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
