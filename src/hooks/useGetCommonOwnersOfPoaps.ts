import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Poap } from '../pages/TokenHolders/types';
import { createCommonOwnersPOAPsQuery } from '../queries/commonOwnersPOAPsQuery';

type Token = Poap;
type NextedTokenBalance = {
  owner: {
    poaps: Token[];
  };
}[];

type CommonOwner = {
  Poaps: {
    Poap: NextedTokenBalance | Token[];
  };
};

const LIMIT = 200;
const MIN_LIMIT = 20;

export function useGetCommonOwnersOfPoaps(eventIds: string[]) {
  const ownersSetRef = useRef<Set<string>>(new Set());
  const itemsRef = useRef<Token[]>([]);
  const [loading, setLoading] = useState(false);
  const [poaps, setPoaps] = useState<Token[]>([]);
  const query = useMemo(
    () => createCommonOwnersPOAPsQuery(eventIds),
    [eventIds]
  );
  const [fetch, { data, pagination }] = useLazyQueryWithPagination(query);

  const { hasNextPage, getNextPage } = pagination;
  // eslint-disable-next-line
  // @ts-ignore
  const totalOwners = window.totalOwners;
  const hasMorePages = !totalOwners ? hasNextPage : poaps.length < totalOwners;
  const fetchSingleToken = eventIds.length === 1;

  useEffect(() => {
    if (!data) return;
    const poaps = data.Poaps?.Poap || ([] as CommonOwner['Poaps']['Poap']);

    let tokens: Token[] = [];

    if (fetchSingleToken) {
      tokens = poaps as Token[];
    } else {
      tokens = (poaps as NextedTokenBalance)
        .filter(token => Boolean(token?.owner?.poaps?.length))
        .reduce(
          (tokens, token) => [...tokens, ...token.owner.poaps],
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
    if (itemsRef.current.length < (totalOwners || MIN_LIMIT)) {
      if (hasNextPage) {
        getNextPage();
      }
    } else {
      setLoading(false);
    }

    if (tokens.length > 0) {
      setPoaps(exiting => [...exiting, ...tokens]);
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
  }, [fetch, fetchSingleToken]);

  return {
    fetch: getTokens,
    poaps,
    loading,
    hasNextPage: hasMorePages,
    getNextPage: getNext
  };
}
