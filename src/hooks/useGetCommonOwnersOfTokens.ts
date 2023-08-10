import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createCommonOwnersQuery } from '../queries/commonOwnersQuery';
import { Token as TokenType } from '../pages/TokenHolders/types';

type Token = TokenType;
type NextedTokenBalance = {
  owner: {
    tokenBalances: Token[];
  };
}[];

type CommonOwner = {
  ethereum: {
    TokenBalance: NextedTokenBalance | Token[];
  };
  polygon: {
    TokenBalance: NextedTokenBalance | Token[];
  };
};

const LIMIT = 200;
const MIN_LIMIT = 20;

export function useGetCommonOwnersOfTokens(tokenAddress: string[]) {
  const ownersSetRef = useRef<Set<string>>(new Set());
  const itemsRef = useRef<Token[]>([]);
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const CommonTokenOwnerQuery = useMemo(
    () => createCommonOwnersQuery(tokenAddress),
    [tokenAddress]
  );
  const [fetch, { data, pagination }] = useLazyQueryWithPagination(
    CommonTokenOwnerQuery
  );

  const { hasNextPage, getNextPage } = pagination;
  // eslint-disable-next-line
  // @ts-ignore
  const totalOwners = window.totalOwners;
  const hasMorePages = !totalOwners ? hasNextPage : tokens.length < totalOwners;
  const fetchSingleToken = tokenAddress.length === 1;

  useEffect(() => {
    if (!data?.ethereum?.TokenBalance) return;
    const ownersInEth = data?.ethereum as CommonOwner['ethereum'];
    const ownersInPolygon = data?.polygon as CommonOwner['polygon'];
    const tokenBalances = [
      ...(ownersInEth?.TokenBalance || []),
      ...(ownersInPolygon?.TokenBalance || [])
    ];
    let tokens: Token[] = [];

    if (fetchSingleToken) {
      tokens = tokenBalances as Token[];
    } else {
      tokens = (tokenBalances as NextedTokenBalance)
        .filter(token => Boolean(token?.owner?.tokenBalances?.length))
        .reduce(
          (tokens, token) => [...tokens, ...token.owner.tokenBalances],
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
      setTokens(exiting => [...exiting, ...tokens]);
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
    setTokens([]);
    fetch({
      limit: fetchSingleToken ? MIN_LIMIT : LIMIT
    });
  }, [fetch, fetchSingleToken]);

  return {
    fetch: getTokens,
    tokens,
    loading,
    hasNextPage: hasMorePages,
    getNextPage: getNext
  };
}
