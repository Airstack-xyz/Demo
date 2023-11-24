import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { defaultSortOrder } from '../Components/Filters/SortBy';
import { tokenTypes } from '../pages/TokenBalances/constants';
import { CommonTokenType, TokenType } from '../pages/TokenBalances/types';
import { getNftWithCommonOwnersQuery } from '../queries/nftWithCommonOwnersQuery';
import { getNftWithCommonOwnersSnapshotQuery } from '../queries/nftWithCommonOwnersSnapshotQuery';
import {
  getActiveSnapshotInfo,
  getSnapshotQueryFilters
} from '../utils/activeSnapshotInfoString';
import { UserInputs } from './useSearchInput';

const LIMIT = 20;
const LIMIT_COMBINATIONS = 25;

function filterByIsSpam(tokens: TokenType[]) {
  return tokens?.filter(item => item?.token?.isSpam !== true);
}

function processTokens(tokens: CommonTokenType[]) {
  if (tokens.length > 0 && tokens[0]?.token?.tokenBalances) {
    tokens = tokens
      .filter((token: CommonTokenType) =>
        Boolean(token?.token?.tokenBalances?.length)
      )
      .map((token: CommonTokenType) => {
        token._common_tokens = token.token.tokenBalances || null;
        return token;
      });
  }
  return tokens;
}

type Inputs = Pick<
  UserInputs,
  | 'address'
  | 'tokenType'
  | 'blockchainType'
  | 'sortOrder'
  | 'spamFilter'
  | 'activeSnapshotInfo'
> & {
  includeERC20?: boolean;
};
export function useGetTokensOfOwner(
  inputs: Inputs,
  onDataReceived: (tokens: TokenType[]) => void
) {
  const {
    address: owners,
    tokenType = '',
    blockchainType,
    sortOrder,
    spamFilter,
    activeSnapshotInfo,
    includeERC20
  } = inputs;
  const visitedTokensSetRef = useRef<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [processedTokensCount, setProcessedTokensCount] = useState(0);
  const tokensRef = useRef<TokenType[]>([]);

  const snapshotInfo = useMemo(
    () => getActiveSnapshotInfo(activeSnapshotInfo),
    [activeSnapshotInfo]
  );

  const query = useMemo(() => {
    const fetchAllBlockchains =
      blockchainType.length === 3 || blockchainType.length === 0;

    const blockchain = fetchAllBlockchains ? null : blockchainType[0];

    if (snapshotInfo.isApplicable) {
      return getNftWithCommonOwnersSnapshotQuery({
        owners,
        blockchain: blockchain,
        snapshotFilter: snapshotInfo.appliedFilter
      });
    }
    return getNftWithCommonOwnersQuery(owners, blockchain);
  }, [
    blockchainType,
    snapshotInfo.isApplicable,
    snapshotInfo.appliedFilter,
    owners
  ]);

  const isPoap = tokenType === 'POAP';
  const is6551 = tokenType === 'ERC6551';

  const isSpamFilteringEnabled = spamFilter !== '0';

  const [
    fetchTokens,
    {
      data: tokensData,
      pagination: { getNextPage, hasNextPage }
    }
  ] = useLazyQueryWithPagination(query, {});

  useEffect(() => {
    if (owners.length === 0) return;

    const isPoap = tokenType === 'POAP';

    if (!tokenType || !isPoap) {
      setLoading(true);
      visitedTokensSetRef.current = new Set();
      tokensRef.current = [];

      const limit = owners.length > 1 ? LIMIT_COMBINATIONS : LIMIT;
      const tokenFilters =
        tokenType && tokenType.length > 0 && !is6551
          ? [tokenType]
          : tokenTypes.filter(
              tokenType => includeERC20 || tokenType !== 'ERC20'
            );
      const sortBy = sortOrder ? sortOrder : defaultSortOrder;

      // For snapshots different variables are being passed
      if (snapshotInfo.isApplicable) {
        const queryFilters = getSnapshotQueryFilters(snapshotInfo);
        fetchTokens({
          limit,
          tokenType: tokenFilters,
          ...queryFilters
        });
      } else {
        fetchTokens({
          limit,
          tokenType: tokenFilters,
          sortBy
        });
      }
    }

    setProcessedTokensCount(0);
  }, [
    fetchTokens,
    includeERC20,
    is6551,
    isPoap,
    owners,
    snapshotInfo,
    sortOrder,
    tokenType
  ]);

  useEffect(() => {
    if (!tokensData) return;
    const { ethereum, polygon, base } = tokensData;
    let ethTokenBalances = ethereum?.TokenBalance || [];
    let polygonTokenBalances = polygon?.TokenBalance || [];
    let baseTokenBalances = base?.TokenBalance || [];

    const processedTokenCount =
      ethTokenBalances.length +
      polygonTokenBalances.length +
      baseTokenBalances.length;
    setProcessedTokensCount(count => count + processedTokenCount);

    ethTokenBalances = processTokens(ethTokenBalances);
    polygonTokenBalances = processTokens(polygonTokenBalances);
    baseTokenBalances = processTokens(baseTokenBalances);

    let tokens = [
      ...ethTokenBalances,
      ...polygonTokenBalances,
      ...baseTokenBalances
    ];

    if (is6551) {
      tokens = tokens.filter((token: CommonTokenType) => {
        const commonTokens = token?._common_tokens || [];
        return (
          token?.tokenNfts?.erc6551Accounts?.length > 0 ||
          commonTokens?.find(
            _token => _token?.tokenNfts?.erc6551Accounts?.length > 0
          )
        );
      });
    }

    if (isSpamFilteringEnabled) {
      tokens = filterByIsSpam(tokens);
      if (tokens.length > 0 && tokens[0]?._common_tokens) {
        tokens = tokens
          .map((token: CommonTokenType) => {
            token._common_tokens = filterByIsSpam(token._common_tokens || []);
            return token;
          })
          .filter((token: CommonTokenType) =>
            Boolean(token?._common_tokens?.length)
          );
      }
    }

    tokensRef.current = [...tokensRef.current, ...tokens];
    onDataReceived(tokens);

    if (hasNextPage && tokensRef.current.length < LIMIT) {
      setLoading(true);
      getNextPage();
      return;
    }
    setLoading(false);
    tokensRef.current = [];
  }, [
    getNextPage,
    hasNextPage,
    is6551,
    isSpamFilteringEnabled,
    onDataReceived,
    tokensData
  ]);

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
      processedTokensCount,
      getNext
    };
  }, [loading, hasNextPage, processedTokensCount, getNext]);
}
