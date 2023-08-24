import { config } from '@airstack/airstack-react/config';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createNftWithCommonOwnersQuery } from '../queries/nftWithCommonOwnersQuery';
import { useSearchInput } from './useSearchInput';
import { defaultSortOrder } from '../pages/TokenBalances/SortBy';
import { tokenTypes } from '../pages/TokenBalances/constants';
import { CommonTokenType, TokenType } from '../pages/TokenBalances/types';
import { useLazyQueryWithPagination } from '@airstack/airstack-react';

const LIMIT = 20;
const LIMIT_COMBINATIONS = 100;

export function useGetTokensOfOwner(
  onDataReceived: (tokens: TokenType[]) => void
) {
  const visitedTokensSetRef = useRef<Set<string>>(new Set());
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

  const filterDuplicateTokens = useCallback((tokens: TokenType[]) => {
    return tokens.filter(token => {
      const id = token.tokenAddress;
      const duplicate = visitedTokensSetRef.current.has(id);
      visitedTokensSetRef.current.add(id);
      return !duplicate;
    });
  }, []);

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
            : tokenTypes.filter(tokenType => tokenType !== 'POAP')
      });
    }

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
    const processedTokenCount = ethTokens.length + maticTokens.length;
    setProcessedTokensCount(count => count + processedTokenCount);

    if (ethTokens.length > 0 && ethTokens[0]?.token?.tokenBalances) {
      ethTokens = ethTokens
        .filter((token: CommonTokenType) =>
          Boolean(token?.token?.tokenBalances?.length)
        )
        .reduce((items: TokenType[], token: CommonTokenType) => {
          items.push({
            ...token.token.tokenBalances[0],
            _tokenId: token?.tokenNfts?.tokenId
          });
          return items;
        }, []);
    }
    if (maticTokens.length > 0 && maticTokens[0]?.token?.tokenBalances) {
      maticTokens = maticTokens
        .filter((token: CommonTokenType) =>
          Boolean(token?.token?.tokenBalances?.length)
        )
        .reduce((items: TokenType[], token: CommonTokenType) => {
          items.push({
            ...token.token.tokenBalances[0],
            _tokenId: token?.tokenNfts?.tokenId
          });
          return items;
        }, []);
    }
    const tokens = filterDuplicateTokens([...ethTokens, ...maticTokens]);
    tokensRef.current = [...tokensRef.current, ...tokens];
    onDataReceived(tokens);

    if (hasNextPage && tokensRef.current.length < LIMIT) {
      setLoading(true);
      getNextPage();
      return;
    }
    setLoading(false);
    tokensRef.current = [];
  }, [
    filterDuplicateTokens,
    getNextPage,
    hasNextPage,
    onDataReceived,
    tokensData
  ]);

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
