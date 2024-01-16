import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Poap, TokenAddress } from '../pages/TokenHolders/types';
import { getCommonOwnersPOAPsQuery } from '../queries/commonOwnersPOAPsQuery';

type Token = Poap;
type NestedTokenBalance = {
  owner: {
    poaps: Token[];
  };
  poapEvent: Token['_poapEvent'];
  eventId: string;
  tokenId: string;
  tokenAddress: string;
  blockchain: string;
}[];

type CommonOwner = {
  Poaps: {
    Poap: NestedTokenBalance | Token[];
  };
};

const LIMIT = 34;
const MIN_LIMIT = 34;

export function useGetCommonOwnersOfPoaps(poapAddresses: TokenAddress[]) {
  const ownersSetRef = useRef<Set<string>>(new Set());
  const itemsRef = useRef<Token[]>([]);
  const [loading, setLoading] = useState(false);
  const [poaps, setPoaps] = useState<Token[]>([]);

  const [processedPoapsCount, setProcessedPoapsCount] = useState(0);

  const query = useMemo(
    () => getCommonOwnersPOAPsQuery({ poaps: poapAddresses }),
    [poapAddresses]
  );
  const [fetch, { data, pagination }] = useLazyQueryWithPagination(query);

  const { hasNextPage, getNextPage } = pagination;
  // eslint-disable-next-line
  // @ts-ignore
  const totalOwners = window.totalOwners;
  const hasMorePages = !totalOwners ? hasNextPage : poaps.length < totalOwners;
  const fetchSingleToken = poapAddresses.length === 1;

  useEffect(() => {
    if (!data) return;
    const poaps = data.Poaps?.Poap || ([] as CommonOwner['Poaps']['Poap']);

    setProcessedPoapsCount(count => count + poaps.length);

    let tokens: Token[] = [];

    if (fetchSingleToken) {
      tokens = poaps as Token[];
    } else {
      tokens = (poaps as NestedTokenBalance)
        .filter(token => Boolean(token?.owner?.poaps?.length))
        .reduce(
          (tokens, token) => [
            ...tokens,
            {
              ...token.owner.poaps[0],
              _tokenId: token.tokenId,
              _tokenAddress: token.tokenAddress,
              _poapEvent: token.poapEvent,
              _eventId: token?.eventId,
              _blockchain: token.blockchain
            }
          ],
          [] as Token[]
        );
    }
    tokens = tokens.filter(token => {
      const address = token?.owner?.identity;
      if (!address) return false;
      if (ownersSetRef.current.has(address)) return false;
      ownersSetRef.current.add(address);
      return true;
    });

    itemsRef.current = [...itemsRef.current, ...tokens];
    setPoaps(prev => [...prev, ...tokens].slice(0, LIMIT));

    const minItemsToFetch =
      totalOwners > 0 ? Math.min(totalOwners, MIN_LIMIT) : MIN_LIMIT;

    if (hasNextPage && itemsRef.current.length < minItemsToFetch) {
      getNextPage();
    } else {
      setLoading(false);
    }
  }, [data, fetchSingleToken, getNextPage, hasNextPage, totalOwners]);

  const getNext = useCallback(() => {
    if (!hasMorePages) return;
    itemsRef.current = [];
    setLoading(true);
    getNextPage();
  }, [getNextPage, hasMorePages]);

  const getTokens = useCallback(() => {
    itemsRef.current = [];
    setLoading(true);
    setPoaps([]);
    fetch({
      limit: fetchSingleToken ? MIN_LIMIT : LIMIT
    });
    setProcessedPoapsCount(0);
  }, [fetch, fetchSingleToken]);

  return {
    fetch: getTokens,
    poaps,
    loading,
    hasNextPage: hasMorePages,
    processedPoapsCount,
    getNextPage: getNext
  };
}
