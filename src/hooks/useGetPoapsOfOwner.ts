import * as airstackReact from '@airstack/airstack-react';
import { config } from '@airstack/airstack-react/config';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchInput } from './useSearchInput';
import { defaultSortOrder } from '../pages/TokenBalances/SortBy';
import { CommonPoapType, PoapType } from '../pages/TokenBalances/types';
import { poapsOfCommonOwnersQuery } from '../queries/poapsOfCommonOwnersQuery';

const LIMIT = 20;

export function useGetPoapsOfOwner(
  onDataReceived: (tokens: PoapType[]) => void
) {
  const [loading, setLoading] = useState(false);
  const tokensRef = useRef<PoapType[]>([]);
  const [
    { address: owners, tokenType: tokenType = '', blockchainType, sortOrder }
  ] = useSearchInput();
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
      data: tokensData,
      pagination: { getNextPage, hasNextPage }
    }
  ] = airstackReact.useLazyQueryWithPagination(query, {}, config);

  useEffect(() => {
    if (owners.length === 0 || !canFetchPoap) return;
    setLoading(true);
    fetchTokens({
      limit: LIMIT,
      sortBy: sortOrder ? sortOrder : defaultSortOrder
    });
    tokensRef.current = [];
  }, [canFetchPoap, fetchTokens, isPoap, owners, sortOrder]);

  useEffect(() => {
    if (!tokensData) return;
    let poaps = tokensData?.Poaps?.Poap;
    if (!poaps) return;

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
    onDataReceived(poaps);
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
      getNext
    };
  }, [loading, hasNextPage, getNext]);
}
