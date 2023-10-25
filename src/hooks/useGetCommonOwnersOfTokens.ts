import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Poap,
  TokenAddress,
  Token as TokenType
} from '../pages/TokenHolders/types';
import { getCommonPoapAndNftOwnersQuery } from '../queries/commonPoapAndNftOwnersQuery';
import {
  getCommonNftOwnersQuery,
  getNftOwnersQuery
} from '../queries/commonNftOwnersQuery';
import { sortAddressByPoapFirst } from '../utils/sortAddressByPoapFirst';
import { useSearchInput } from './useSearchInput';
import {
  getCommonNftOwnersSnapshotQuery,
  getNftOwnersSnapshotQuery
} from '../queries/commonNftOwnersSnapshotQuery';
import { getActiveSnapshotInfo } from '../utils/activeSnapshotInfoString';

type Token = TokenType & {
  _poapEvent?: Poap['poapEvent'];
  _blockchain?: string;
  eventId?: string;
};

type NestedTokenBalance = (Pick<
  Token,
  'tokenAddress' | 'tokenId' | 'token' | 'tokenNfts'
> &
  Pick<Poap, 'poapEvent' | 'eventId'> & {
    owner: {
      tokenBalances: Token[];
    };
    poapEvent?: Poap['poapEvent'];
    blockchain?: string;
  })[];

type CommonOwner = {
  ethereum: {
    TokenBalance: NestedTokenBalance | Token[];
  };
  polygon: {
    TokenBalance: NestedTokenBalance | Token[];
  };
};

const LIMIT = 200;
const MIN_LIMIT = 50;

export function useGetCommonOwnersOfTokens(tokenAddress: TokenAddress[]) {
  const ownersSetRef = useRef<Set<string>>(new Set());
  const itemsRef = useRef<Token[]>([]);
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [processedTokensCount, setProcessedTokensCount] = useState(LIMIT);

  const [{ activeSnapshotInfo }] = useSearchInput();

  const hasPoap = tokenAddress.some(token => !token.address.startsWith('0x'));

  const snapshotInfo = useMemo(
    () => getActiveSnapshotInfo(activeSnapshotInfo),
    [activeSnapshotInfo]
  );

  const query = useMemo(() => {
    if (tokenAddress.length === 1) {
      if (snapshotInfo.isApplicable) {
        return getNftOwnersSnapshotQuery({
          address: tokenAddress[0].address,
          blockNumber: snapshotInfo.blockNumber,
          date: snapshotInfo.date,
          timestamp: snapshotInfo.timestamp
        });
      }
      return getNftOwnersQuery(tokenAddress[0].address);
    }
    if (hasPoap) {
      const tokens = sortAddressByPoapFirst(tokenAddress);
      return getCommonPoapAndNftOwnersQuery(tokens[0], tokens[1]);
    }
    if (snapshotInfo.isApplicable) {
      return getCommonNftOwnersSnapshotQuery({
        address1: tokenAddress[0],
        address2: tokenAddress[1],
        blockNumber: snapshotInfo.blockNumber,
        date: snapshotInfo.date,
        timestamp: snapshotInfo.timestamp
      });
    }
    return getCommonNftOwnersQuery(tokenAddress[0], tokenAddress[1]);
  }, [
    tokenAddress,
    hasPoap,
    snapshotInfo.isApplicable,
    snapshotInfo.blockNumber,
    snapshotInfo.date,
    snapshotInfo.timestamp
  ]);

  const [fetch, { data, pagination }] = useLazyQueryWithPagination(query);

  const { hasNextPage, getNextPage } = pagination;
  // eslint-disable-next-line
  // @ts-ignore
  const totalOwners = window.totalOwners || 0;
  const hasMorePages = !totalOwners
    ? hasNextPage
    : hasNextPage === false
    ? false
    : tokens.length < totalOwners;
  const fetchSingleToken = tokenAddress.length === 1;

  useEffect(() => {
    if (!data) return;
    if (
      hasPoap
        ? !data.Poaps?.Poap
        : !data.ethereum?.TokenBalance && !data?.polygon?.TokenBalance
    ) {
      // if there is no data, hide the loader
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
      tokens = (tokenBalances as NestedTokenBalance)
        .filter(token => Boolean(token?.owner?.tokenBalances?.length))
        .reduce(
          (tokens, token) => [
            ...tokens,
            {
              ...token.owner.tokenBalances[0],
              _tokenAddress: token.tokenAddress,
              _tokenId: token.tokenId,
              _token: token.token,
              _tokenNfts: token.tokenNfts,
              _poapEvent: token.poapEvent,
              _eventId: token.eventId,
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
    const minItemsToFetch =
      totalOwners > 0 ? Math.min(totalOwners, MIN_LIMIT) : MIN_LIMIT;
    if (hasNextPage && itemsRef.current.length < minItemsToFetch) {
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
    ownersSetRef.current = new Set();

    const limit = fetchSingleToken ? MIN_LIMIT : LIMIT;

    if (snapshotInfo.isApplicable) {
      fetch({
        limit: limit,
        blockNumber: snapshotInfo.blockNumber,
        date: snapshotInfo.date,
        timestamp: snapshotInfo.timestamp
      });
    } else {
      fetch({
        limit: limit
      });
    }

    setProcessedTokensCount(LIMIT);
  }, [
    fetch,
    tokenAddress.length,
    fetchSingleToken,
    snapshotInfo.isApplicable,
    snapshotInfo.blockNumber,
    snapshotInfo.date,
    snapshotInfo.timestamp
  ]);

  return {
    fetch: getTokens,
    tokens,
    loading,
    hasNextPage: hasMorePages,
    processedTokensCount,
    getNextPage: getNext
  };
}
