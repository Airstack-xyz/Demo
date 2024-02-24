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
  onDataReceived: (tokens: PoapType[], hasNextPage: boolean) => void,
  poapDisabled = false,
  shouldBatchResults = false
) {
  const shouldBatch = useRef(shouldBatchResults);
  shouldBatch.current = shouldBatchResults;
  const { address: owners, tokenType = '', blockchainType, sortOrder } = inputs;
  const visitedTokensSetRef = useRef<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const tokensRef = useRef<PoapType[]>([]);
  const [processedPoapsCount, setProcessedPoapsCount] = useState(0);

  const isCombination = owners.length > 1;

  const canFetchPoaps = !poapDisabled;

  const query = useMemo(() => {
    return poapsOfCommonOwnersQuery({ owners });
  }, [owners]);

  const [
    fetchTokens,
    {
      data,
      pagination: { getNextPage, hasNextPage }
    }
  ] = useLazyQueryWithPagination(query, {});

  const tokensData = !canFetchPoaps ? null : data;

  useEffect(() => {
    if (owners.length === 0 || !canFetchPoaps) return;

    setLoading(true);
    visitedTokensSetRef.current = new Set();
    tokensRef.current = [];

    fetchTokens({
      limit: owners.length > 1 ? LIMIT_COMBINATIONS : LIMIT,
      sortBy: sortOrder ? sortOrder : defaultSortOrder
    });

    setProcessedPoapsCount(0);
  }, [
    canFetchPoaps,
    fetchTokens,
    owners,
    sortOrder,
    blockchainType,
    tokenType
  ]);

  useEffect(() => {
    if (!tokensData) return;

    let poaps = tokensData?.Poaps?.Poap || [];
    const processedPoapsCount = poaps.length;

    if (poaps.length > 0 && isCombination) {
      poaps = poaps.reduce((items: CommonPoapType[], poap: CommonPoapType) => {
        if (poap?.poapEvent?.poaps?.length > 0) {
          poap._common_tokens = poap.poapEvent.poaps;
          items.push(poap);
        }
        return items;
      }, []);
    }

    tokensRef.current = [...tokensRef.current, ...poaps];
    setProcessedPoapsCount(count => count + processedPoapsCount);

    if (!shouldBatch.current) {
      onDataReceived(poaps, hasNextPage);
    }

    if (hasNextPage && tokensRef.current.length < LIMIT) {
      setLoading(true);
      getNextPage();
    } else {
      if (shouldBatch.current) {
        onDataReceived(tokensRef.current, hasNextPage);
      }
      setLoading(false);
      tokensRef.current = [];
    }
  }, [
    canFetchPoaps,
    isCombination,
    getNextPage,
    hasNextPage,
    onDataReceived,
    tokensData
  ]);

  const getNext = useCallback(() => {
    if (!hasNextPage || !canFetchPoaps) return;
    setLoading(true);
    tokensRef.current = [];
    getNextPage();
  }, [canFetchPoaps, getNextPage, hasNextPage]);

  return useMemo(() => {
    return {
      loading,
      hasNextPage,
      processedPoapsCount,
      getNext
    };
  }, [loading, hasNextPage, processedPoapsCount, getNext]);
}
