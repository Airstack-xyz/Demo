import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchInput } from './useSearchInput';
import { defaultSortOrder } from '../pages/TokenBalances/SortBy';
import { CommonPoapType, PoapType } from '../pages/TokenBalances/types';
import { poapsOfCommonOwnersQuery } from '../queries/poapsOfCommonOwnersQuery';
import { useLazyQueryWithPagination } from '@airstack/airstack-react';

const LIMIT = 20;
const LIMIT_COMBINATIONS = 100;

export function useGetPoapsOfOwner(
  onDataReceived: (tokens: PoapType[]) => void
) {
  const visitedTokensSetRef = useRef<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const tokensRef = useRef<PoapType[]>([]);
  const [processedTokensCount, setProcessedTokensCount] = useState(LIMIT);
  const [{ address: owners, tokenType = '', blockchainType, sortOrder }] =
    useSearchInput();
  const isPoap = tokenType === 'POAP';

  const query = useMemo(() => {
    return poapsOfCommonOwnersQuery(owners);
  }, [owners]);

  const canFetchPoap = useMemo(() => {
    const hasPolygonChainFilter =
      blockchainType.length === 1 && blockchainType[0] === 'polygon';
    return !hasPolygonChainFilter && (!tokenType || isPoap);
  }, [blockchainType, isPoap, tokenType]);

  const [
    fetchTokens,
    {
      data,
      pagination: { getNextPage, hasNextPage }
    }
  ] = useLazyQueryWithPagination(query);

  const tokensData = !canFetchPoap ? null : data;

  useEffect(() => {
    if (owners.length === 0 || !canFetchPoap) return;
    setLoading(true);
    visitedTokensSetRef.current = new Set();
    tokensRef.current = [];
    fetchTokens({
      limit: owners.length > 1 ? LIMIT_COMBINATIONS : LIMIT,
      sortBy: sortOrder ? sortOrder : defaultSortOrder
    });
    setProcessedTokensCount(LIMIT);
  }, [canFetchPoap, fetchTokens, owners, sortOrder, blockchainType, tokenType]);

  useEffect(() => {
    if (!tokensData) return;
    let poaps = tokensData?.Poaps?.Poap || [];
    const processedTokensCount = poaps.length;

    if (poaps.length > 0 && poaps[0]?.poapEvent?.poaps) {
      poaps = poaps.reduce((poaps: PoapType[], poap: CommonPoapType) => {
        const _poap = poap.poapEvent.poaps[0];
        if (_poap) {
          poaps.push(_poap);
        }
        return poaps;
      }, []);
    }
    tokensRef.current = [...tokensRef.current, ...poaps];
    setProcessedTokensCount(count => count + processedTokensCount);
    onDataReceived(poaps);
    if (hasNextPage && tokensRef.current.length < LIMIT) {
      setLoading(true);
      getNextPage();
      return;
    }
    setLoading(false);
    tokensRef.current = [];
  }, [canFetchPoap, getNextPage, hasNextPage, onDataReceived, tokensData]);

  const getNext = useCallback(() => {
    if (!hasNextPage || !canFetchPoap) return;
    setLoading(true);
    tokensRef.current = [];
    getNextPage();
  }, [canFetchPoap, getNextPage, hasNextPage]);

  return useMemo(() => {
    return {
      loading,
      hasNextPage,
      processedTokensCount,
      getNext
    };
  }, [loading, hasNextPage, processedTokensCount, getNext]);
}
