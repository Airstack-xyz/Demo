import { config } from '@airstack/airstack-react/config';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createNftWithCommonOwnersQuery } from '../queries/nftWithCommonOwnersQuery';
import { useSearchInput } from './useSearchInput';
import { defaultSortOrder } from '../Components/DropdownFilters/SortBy';
import { tokenTypes } from '../pages/TokenBalances/constants';
import { CommonTokenType, TokenType } from '../pages/TokenBalances/types';
import { createNftWithCommonOwnersSnapshotQuery } from '../queries/nftWithCommonOwnersSnapshotQuery';
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
    {
      address: owners,
      tokenType: tokenType = '',
      blockchainType,
      sortOrder,
      snapshotBlockNumber,
      snapshotDate,
      snapshotTimestamp
    }
  ] = useSearchInput();

  const isSnapshotQuery = Boolean(
    snapshotBlockNumber || snapshotDate || snapshotTimestamp
  );

  const query = useMemo(() => {
    const fetchAllBlockchains =
      blockchainType.length === 2 || blockchainType.length === 0;

    const _blockchain = fetchAllBlockchains ? null : blockchainType[0];

    if (isSnapshotQuery) {
      return createNftWithCommonOwnersSnapshotQuery({
        owners,
        blockchain: _blockchain,
        blockNumber: snapshotBlockNumber,
        date: snapshotDate,
        timestamp: snapshotTimestamp
      });
    }
    return createNftWithCommonOwnersQuery(owners, _blockchain);
  }, [
    owners,
    blockchainType,
    isSnapshotQuery,
    snapshotBlockNumber,
    snapshotDate,
    snapshotTimestamp
  ]);

  const [
    fetchTokens,
    {
      data: tokensData,
      pagination: { getNextPage, hasNextPage }
    }
  ] = useLazyQueryWithPagination(query, {}, config);

  useEffect(() => {
    if (owners.length === 0) return;

    const isPoap = tokenType === 'POAP';

    if (!tokenType || !isPoap) {
      setLoading(true);
      visitedTokensSetRef.current = new Set();
      tokensRef.current = [];

      const _limit = owners.length > 1 ? LIMIT_COMBINATIONS : LIMIT;
      const _tokenType =
        tokenType && tokenType.length > 0
          ? [tokenType]
          : tokenTypes.filter(tokenType => tokenType !== 'POAP');

      // For snapshots different variables are being passed
      if (isSnapshotQuery) {
        fetchTokens({
          limit: _limit,
          tokenType: _tokenType,
          blockNumber: snapshotBlockNumber,
          date: snapshotDate,
          timestamp: snapshotTimestamp
        });
      } else {
        fetchTokens({
          limit: _limit,
          tokenType: _tokenType,
          sortBy: sortOrder ? sortOrder : defaultSortOrder
        });
      }
    }

    setProcessedTokensCount(LIMIT);
  }, [
    fetchTokens,
    owners.length,
    blockchainType,
    sortOrder,
    tokenType,
    isSnapshotQuery,
    snapshotBlockNumber,
    snapshotDate,
    snapshotTimestamp
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
