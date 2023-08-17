import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Poap, Token as TokenType } from '../pages/TokenHolders/types';
import { getCommonPoapAndNftOwnersQuery } from '../queries/commonPoapAndNftOwnersQuery';
import {
  getCommonNftOwnersQuery,
  getNftOwnersQuery
} from '../queries/commonNftOwnersQuery';

type Token = TokenType & {
  _poapEvent?: Poap['poapEvent'];
};

type NextedTokenBalance = (Pick<Token, 'tokenAddress' | 'tokenId' | 'token'> &
  Pick<Poap, 'poapEvent'> & {
    owner: {
      tokenBalances: Token[];
    };
    poapEvent?: Poap['poapEvent'];
  })[];

type CommonOwner = {
  ethereum: {
    TokenBalance: NextedTokenBalance | Token[];
  };
  polygon: {
    TokenBalance: NextedTokenBalance | Token[];
  };
};

const LIMIT = 200;
const MIN_LIMIT = 200;

function sortArray(array: string[]) {
  const startsWith0x: string[] = [];
  const notStartsWith0x: string[] = [];

  for (const item of array) {
    if (item.startsWith('0x')) {
      startsWith0x.push(item);
    } else {
      notStartsWith0x.push(item);
    }
  }

  return [...notStartsWith0x, ...startsWith0x];
}

export function useGetCommonOwnersOfTokens(tokenAddress: string[]) {
  const ownersSetRef = useRef<Set<string>>(new Set());
  const itemsRef = useRef<Token[]>([]);
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [processedTokensCount, setProcessedTokensCount] = useState(LIMIT);

  const hasPoap = tokenAddress.some(token => !token.startsWith('0x'));

  const query = useMemo(() => {
    if (tokenAddress.length === 1) return getNftOwnersQuery(tokenAddress[0]);
    if (hasPoap) {
      const tokens = sortArray(tokenAddress);
      return getCommonPoapAndNftOwnersQuery(tokens[0], tokens[1]);
    }
    return getCommonNftOwnersQuery(tokenAddress[0], tokenAddress[1]);
  }, [hasPoap, tokenAddress]);

  const [fetch, { data, pagination }] = useLazyQueryWithPagination(query);

  const { hasNextPage, getNextPage } = pagination;
  // eslint-disable-next-line
  // @ts-ignore
  const totalOwners = window.totalOwners;
  const hasMorePages = !totalOwners
    ? hasNextPage
    : hasNextPage === false
    ? false
    : tokens.length < totalOwners;
  const fetchSingleToken = tokenAddress.length === 1;

  useEffect(() => {
    if (
      hasPoap
        ? !data?.Poaps?.Poap
        : !data?.ethereum?.TokenBalance && !data?.polygon?.TokenBalance
    ) {
      setLoading(false);
      return;
    }

    let tokenBalances = [];

    const ownersInEth = data?.ethereum as CommonOwner['ethereum'];
    const ownersInPolygon = data?.polygon as CommonOwner['polygon'];

    if (hasPoap) {
      tokenBalances = data.Poaps?.Poap;
    } else {
      tokenBalances = [
        ...(ownersInEth?.TokenBalance || []),
        ...(ownersInPolygon?.TokenBalance || [])
      ];
    }

    let tokens: Token[] = [];

    if (fetchSingleToken) {
      tokens = tokenBalances as Token[];
    } else {
      tokens = (tokenBalances as NextedTokenBalance)
        .filter(token => Boolean(token?.owner?.tokenBalances?.length))
        .reduce(
          (tokens, token) => [
            ...tokens,
            {
              ...token.owner.tokenBalances[0],
              _tokenAddress: token.tokenAddress,
              _tokenId: token.tokenId,
              _token: token.token,
              _poapEvent: token.poapEvent
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
    if (hasNextPage && itemsRef.current.length < (totalOwners || MIN_LIMIT)) {
      getNextPage();
    } else {
      setLoading(false);
    }

    if (tokens.length > 0) {
      setTokens(exiting => [...exiting, ...tokens]);
    }
    setProcessedTokensCount(count => count + tokenBalances.length);
  }, [data, fetchSingleToken, getNextPage, hasNextPage, hasPoap, totalOwners]);

  const getNext = useCallback(() => {
    if (!hasMorePages) return;
    itemsRef.current = [];
    setLoading(true);
    getNextPage();
  }, [getNextPage, hasMorePages]);

  const getTokens = useCallback(() => {
    if (tokenAddress.length === 0) return;
    itemsRef.current = [];
    setLoading(true);
    setTokens([]);
    fetch({
      limit: fetchSingleToken ? MIN_LIMIT : LIMIT
    });
    setProcessedTokensCount(LIMIT);
  }, [fetch, fetchSingleToken, tokenAddress.length]);

  return {
    fetch: getTokens,
    tokens,
    loading,
    hasNextPage: hasMorePages,
    processedTokensCount,
    getNextPage: getNext
  };
}
