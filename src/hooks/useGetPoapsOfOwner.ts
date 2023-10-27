import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { defaultSortOrder } from '../Components/Filters/SortBy';
import { CommonPoapType, PoapType } from '../pages/TokenBalances/types';
import { poapsOfCommonOwnersQuery } from '../queries/poapsOfCommonOwnersQuery';
import { UserInputs } from './useSearchInput';

const LIMIT = 20;
const LIMIT_COMBINATIONS = 100;

type Inputs = Pick<
  UserInputs,
  'address' | 'tokenType' | 'blockchainType' | 'sortOrder'
>;
export function useGetPoapsOfOwner(
  inputs: Inputs,
  onDataReceived: (tokens: PoapType[]) => void,
  noFetch = false
) {
  const { address: owners, tokenType = '', blockchainType, sortOrder } = inputs;
  const visitedTokensSetRef = useRef<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const tokensRef = useRef<PoapType[]>([]);
  const [processedTokensCount, setProcessedTokensCount] = useState(LIMIT);
  const isPoap = tokenType === 'POAP';
  const searchingCommonPoaps = owners.length > 1;

  const query = useMemo(() => {
    return poapsOfCommonOwnersQuery(owners);
  }, [owners]);

  const canFetchPoap = useMemo(() => {
    if (noFetch) return false;
    const hasPolygonChainFilter =
      blockchainType.length === 1 && blockchainType[0] === 'polygon';
    return !hasPolygonChainFilter && (!tokenType || isPoap);
  }, [blockchainType, isPoap, noFetch, tokenType]);

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
  }, [
    canFetchPoap,
    fetchTokens,
    owners,
    sortOrder,
    blockchainType,
    tokenType,
    noFetch
  ]);

  useEffect(() => {
    if (!tokensData) return;
    let poaps = tokensData?.Poaps?.Poap || [];
    const processedTokensCount = poaps.length;
    if (poaps.length > 0 && searchingCommonPoaps) {
      poaps = poaps.reduce((items: CommonPoapType[], poap: CommonPoapType) => {
        if (poap?.poapEvent?.poaps?.length > 0) {
          poap._common_tokens = poap.poapEvent.poaps;
          items.push(poap);
        }
        return items;
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
  }, [
    canFetchPoap,
    searchingCommonPoaps,
    getNextPage,
    hasNextPage,
    onDataReceived,
    tokensData
  ]);

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
