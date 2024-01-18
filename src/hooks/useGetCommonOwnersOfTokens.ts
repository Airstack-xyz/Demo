import {
  fetchQuery,
  useLazyQueryWithPagination
} from '@airstack/airstack-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { snapshotBlockchains, tokenBlockchains } from '../constants';
import {
  Poap as PoapType,
  TokenAddress,
  Token as TokenType
} from '../pages/TokenHolders/types';
import {
  getCommonNftOwnersSnapshotQuery,
  getNftOwnersSnapshotQuery
} from '../queries/Snapshots/commonNftOwnersSnapshotQuery';
import {
  getCommonNftOwnersQuery,
  getNftOwnersQuery
} from '../queries/commonNftOwnersQuery';
import { getCommonPoapAndNftOwnersQuery } from '../queries/commonPoapAndNftOwnersQuery';
import {
  getActiveSnapshotInfo,
  getSnapshotQueryFilters
} from '../utils/activeSnapshotInfoString';
import { sortAddressByPoapFirst } from '../utils/sortAddressByPoapFirst';
import { useSearchInput } from './useSearchInput';
import { resolve6551Owner } from './useResolve6551Owner';
import { walletDetailsQuery } from '../queries/walletDetails';

type Token = TokenType & {
  _poapEvent?: PoapType['poapEvent'];
  _blockchain?: string;
  eventId?: string;
};

type NestedToken = Pick<
  Token,
  'tokenAddress' | 'tokenId' | 'token' | 'tokenNfts'
> &
  Pick<PoapType, 'poapEvent' | 'eventId'> & {
    owner: {
      tokenBalances: Token[];
    };
    poapEvent?: PoapType['poapEvent'];
    blockchain?: string;
  };

const LIMIT = 34;

export function useGetCommonOwnersOfTokens(tokenAddresses: TokenAddress[]) {
  const ownersSetRef = useRef<Set<string>>(new Set());
  const itemsRef = useRef<Token[]>([]);
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);

  const [processedTokensCount, setProcessedTokensCount] = useState(0); // for showing total scanned count
  const [resolvedTokensCount, setResolvedTokensCount] = useState(0); // for showing 6551 resolved count

  const [{ activeSnapshotInfo, resolve6551 }] = useSearchInput();

  const hasSomePoap = tokenAddresses.some(
    item => !item.address.startsWith('0x')
  );

  const isResolve6551Enabled = resolve6551 === '1';

  const snapshotInfo = useMemo(
    () => getActiveSnapshotInfo(activeSnapshotInfo),
    [activeSnapshotInfo]
  );

  const query = useMemo(() => {
    if (tokenAddresses.length === 1) {
      if (snapshotInfo.isApplicable) {
        return getNftOwnersSnapshotQuery({
          tokenAddress: tokenAddresses[0],
          snapshotFilter: snapshotInfo.appliedFilter
        });
      }
      return getNftOwnersQuery({ tokenAddress: tokenAddresses[0] });
    }
    if (hasSomePoap) {
      const addresses = sortAddressByPoapFirst(tokenAddresses);
      return getCommonPoapAndNftOwnersQuery({
        poapAddress: addresses[0],
        tokenAddress: addresses[1]
      });
    }
    if (snapshotInfo.isApplicable) {
      return getCommonNftOwnersSnapshotQuery({
        tokenAddress1: tokenAddresses[0],
        tokenAddress2: tokenAddresses[1],
        snapshotFilter: snapshotInfo.appliedFilter
      });
    }
    return getCommonNftOwnersQuery({
      tokenAddress1: tokenAddresses[0],
      tokenAddress2: tokenAddresses[1]
    });
  }, [
    tokenAddresses,
    hasSomePoap,
    snapshotInfo.isApplicable,
    snapshotInfo.appliedFilter
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
  const fetchSingleToken = tokenAddresses.length === 1;

  useEffect(() => {
    async function processData() {
      if (!data) return;

      const appropriateBlockchains = snapshotInfo.isApplicable
        ? snapshotBlockchains
        : tokenBlockchains;

      if (
        hasSomePoap
          ? !data.Poaps?.Poap
          : !appropriateBlockchains.some(
              blockchain => data?.[blockchain]?.TokenBalance
            )
      ) {
        setLoading(false);
        return;
      }

      let tokenBalances: NestedToken[] | Token[] = [];

      if (hasSomePoap) {
        tokenBalances = data.Poaps?.Poap;
      } else {
        appropriateBlockchains.forEach(blockchain => {
          const balances = data?.[blockchain]?.TokenBalance || [];
          tokenBalances.push(...balances);
        });
      }

      setProcessedTokensCount(count => count + tokenBalances.length);

      let tokens: Token[] = [];

      if (fetchSingleToken) {
        tokens = tokenBalances as Token[];
      } else {
        tokens = (tokenBalances as NestedToken[])
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

      if (isResolve6551Enabled) {
        // Filter out unresolvable tokens (which are not part of ERC65551 account)
        tokens = tokens.filter(
          token =>
            !!token?.owner?.identity && token?.owner?.accounts?.length > 0
        );
        for (let i = 0; i < tokens.length; i++) {
          const owner = tokens[i]?.owner;
          // resolve ERC65551 account address to actual owner address
          const resolvedData = await resolve6551Owner({
            address: owner.identity,
            blockchain: owner.blockchain
          });
          const ownerAddress = resolvedData?.data?.ownerAddress;
          if (!ownerAddress) {
            itemsRef.current = [...itemsRef.current, tokens[i]];
            setTokens(prev => [...prev, tokens[i]].slice(0, LIMIT));
            continue;
          }
          // fetch wallet data for the resolved address
          const walletData = await fetchQuery(walletDetailsQuery, {
            address: ownerAddress,
            blockchain: owner.blockchain
          });
          const ownerWallet = walletData?.data?.Wallet;
          if (!ownerWallet) {
            itemsRef.current = [...itemsRef.current, tokens[i]];
            setTokens(prev => [...prev, tokens[i]].slice(0, LIMIT));
            continue;
          }
          // merge wallet data in token so that, correct social info can be displayed
          tokens[i].owner = {
            ...tokens[i]?.owner,
            ...ownerWallet
          };
          itemsRef.current = [...itemsRef.current, tokens[i]];
          setResolvedTokensCount(count => count + 1);
          setTokens(prev => [...prev, tokens[i]].slice(0, LIMIT));
        }
      } else {
        itemsRef.current = [...itemsRef.current, ...tokens];
        setTokens(prev => [...prev, ...tokens].slice(0, LIMIT));
      }

      const minItemsToFetch =
        totalOwners > 0 ? Math.min(totalOwners, LIMIT) : LIMIT;

      if (hasNextPage && itemsRef.current.length < minItemsToFetch) {
        getNextPage();
      } else {
        setLoading(false);
      }
    }

    processData();
  }, [
    data,
    fetchSingleToken,
    getNextPage,
    hasNextPage,
    hasSomePoap,
    isResolve6551Enabled,
    snapshotInfo.isApplicable,
    totalOwners
  ]);

  const getNext = useCallback(() => {
    if (!hasMorePages) return;
    itemsRef.current = [];
    setLoading(true);
    getNextPage();
  }, [getNextPage, hasMorePages]);

  const getTokens = useCallback(() => {
    if (tokenAddresses.length === 0) return;

    itemsRef.current = [];
    setLoading(true);
    setTokens([]);
    ownersSetRef.current = new Set();

    if (snapshotInfo.isApplicable) {
      const queryFilters = getSnapshotQueryFilters(snapshotInfo);
      fetch({
        limit: LIMIT,
        ...queryFilters
      });
    } else {
      fetch({
        limit: LIMIT
      });
    }

    setProcessedTokensCount(0);
    setResolvedTokensCount(0);
  }, [tokenAddresses.length, snapshotInfo, fetch]);

  return {
    fetch: getTokens,
    tokens,
    loading,
    hasNextPage: hasMorePages,
    processedTokensCount,
    resolvedTokensCount,
    getNextPage: getNext
  };
}
