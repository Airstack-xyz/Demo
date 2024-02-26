import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { defaultSortOrder } from '../Components/Filters/SortBy';
import { snapshotBlockchains, tokenBlockchains } from '../constants';
import { tokenTypes } from '../pages/TokenBalances/constants';
import { CommonTokenType, TokenType } from '../pages/TokenBalances/types';
import { getNftWithCommonOwnersSnapshotQuery } from '../queries/Snapshots/nftWithCommonOwnersSnapshotQuery';
import { getNftWithCommonOwnersQuery } from '../queries/nftWithCommonOwnersQuery';
import {
  getActiveSnapshotInfo,
  getSnapshotQueryFilters
} from '../utils/activeSnapshotInfoString';
import { UserInputs } from './useSearchInput';

const LIMIT = 20;
const LIMIT_COMBINATIONS = 25;

function filterByMintsOnly(tokens: TokenType[]) {
  return tokens?.filter(item => item?.tokenTransfers?.[0]?.type === 'MINT');
}

function filterByIsSpam(tokens: TokenType[]) {
  return tokens?.filter(item => item?.token?.isSpam !== true);
}

function processTokens(tokens: CommonTokenType[]) {
  if (tokens.length > 0 && tokens[0]?.token?.tokenBalances) {
    tokens = tokens
      .filter(token => Boolean(token?.token?.tokenBalances?.length))
      .map(token => {
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
  | 'mintFilter'
  | 'activeSnapshotInfo'
> & {
  includeERC20?: boolean;
};

export function useGetTokensOfOwner(
  inputs: Inputs,
  onDataReceived: (tokens: TokenType[], hasNextPage: boolean) => void,
  tokenDisabled = false,
  shouldBatchResults = false
) {
  const shouldBatch = useRef(shouldBatchResults);
  shouldBatch.current = shouldBatchResults;
  const {
    address: owners,
    tokenType = '',
    blockchainType,
    sortOrder,
    spamFilter,
    mintFilter,
    activeSnapshotInfo,
    includeERC20
  } = inputs;
  const visitedTokensSetRef = useRef<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [processedTokensCount, setProcessedTokensCount] = useState(0);
  const tokensRef = useRef<TokenType[]>([]);

  const is6551 = tokenType === 'ERC6551';

  const isSpamFilteringEnabled = spamFilter !== '0';
  const isMintFilteringEnabled = mintFilter === '1';

  const hasAllChainFilter = blockchainType?.length === 0;

  const canFetchTokens = !tokenDisabled;

  const snapshotInfo = useMemo(
    () => getActiveSnapshotInfo(activeSnapshotInfo),
    [activeSnapshotInfo]
  );

  const query = useMemo(() => {
    const blockchain = hasAllChainFilter ? null : blockchainType[0];

    if (snapshotInfo.isApplicable) {
      return getNftWithCommonOwnersSnapshotQuery({
        owners,
        blockchain: blockchain,
        snapshotFilter: snapshotInfo.appliedFilter
      });
    }
    return getNftWithCommonOwnersQuery({
      owners,
      blockchain: blockchain,
      mintsOnly: isMintFilteringEnabled
    });
  }, [
    hasAllChainFilter,
    blockchainType,
    snapshotInfo.isApplicable,
    snapshotInfo.appliedFilter,
    owners,
    isMintFilteringEnabled
  ]);

  const [
    fetchTokens,
    {
      data: tokensData,
      pagination: { getNextPage, hasNextPage }
    }
  ] = useLazyQueryWithPagination(query, {});

  useEffect(() => {
    if (owners.length === 0 || !canFetchTokens) return;

    setLoading(true);
    visitedTokensSetRef.current = new Set();
    tokensRef.current = [];

    const limit = owners.length > 1 ? LIMIT_COMBINATIONS : LIMIT;
    const tokenFilters =
      tokenType && tokenType.length > 0 && !is6551
        ? [tokenType]
        : tokenTypes.filter(tokenType => includeERC20 || tokenType !== 'ERC20');
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

    setProcessedTokensCount(0);
  }, [
    canFetchTokens,
    fetchTokens,
    includeERC20,
    is6551,
    owners.length,
    snapshotInfo,
    sortOrder,
    tokenType
  ]);

  useEffect(() => {
    if (!tokensData) return;

    const appropriateBlockchains = snapshotInfo.isApplicable
      ? snapshotBlockchains
      : tokenBlockchains;

    let processedTokenCount = 0;

    appropriateBlockchains.forEach(blockchain => {
      const balances = tokensData?.[blockchain]?.TokenBalance || [];
      processedTokenCount += balances.length;
    });
    setProcessedTokensCount(count => count + processedTokenCount);

    let tokens: TokenType[] | CommonTokenType[] = [];

    appropriateBlockchains.forEach(blockchain => {
      const balances = tokensData?.[blockchain]?.TokenBalance || [];
      tokens.push(...processTokens(balances));
    });

    if (is6551) {
      tokens = (tokens as CommonTokenType[]).filter(token => {
        const commonTokens = token?._common_tokens || [];
        return (
          token?.tokenNfts?.erc6551Accounts?.length > 0 ||
          commonTokens?.find(
            _token => _token?.tokenNfts?.erc6551Accounts?.length > 0
          )
        );
      });
    }

    if (isMintFilteringEnabled) {
      tokens = filterByMintsOnly(tokens);
      if (tokens.length > 0 && tokens[0]?._common_tokens) {
        tokens = (tokens as CommonTokenType[])
          .map(token => {
            token._common_tokens = filterByMintsOnly(
              token._common_tokens || []
            );
            return token;
          })
          .filter(token => Boolean(token?._common_tokens?.length));
      }
    }

    if (isSpamFilteringEnabled) {
      tokens = filterByIsSpam(tokens);
      if (tokens.length > 0 && tokens[0]?._common_tokens) {
        tokens = (tokens as CommonTokenType[])
          .map(token => {
            token._common_tokens = filterByIsSpam(token._common_tokens || []);
            return token;
          })
          .filter(token => Boolean(token?._common_tokens?.length));
      }
    }

    tokensRef.current = [...tokensRef.current, ...tokens];
    if (!shouldBatch.current) {
      onDataReceived(tokens, hasNextPage);
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
    getNextPage,
    hasNextPage,
    is6551,
    isMintFilteringEnabled,
    isSpamFilteringEnabled,
    onDataReceived,
    snapshotInfo.isApplicable,
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
