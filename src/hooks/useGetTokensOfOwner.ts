import { config } from '@airstack/airstack-react/config';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createNftWithCommonOwnersQuery } from '../queries/nftWithCommonOwnersQuery';
import { defaultSortOrder } from '../Components/Filters/SortBy';
import { UserInputs } from './useSearchInput';
import { tokenTypes } from '../pages/TokenBalances/constants';
import { CommonTokenType, TokenType } from '../pages/TokenBalances/types';
import { createNftWithCommonOwnersSnapshotQuery } from '../queries/nftWithCommonOwnersSnapshotQuery';
import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { getActiveSnapshotInfo } from '../utils/activeSnapshotInfoString';

const LIMIT = 20;
const LIMIT_COMBINATIONS = 100;

type Inputs = Pick<
  UserInputs,
  | 'address'
  | 'tokenType'
  | 'blockchainType'
  | 'sortOrder'
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
    activeSnapshotInfo,
    includeERC20
  } = inputs;
  const visitedTokensSetRef = useRef<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [processedTokensCount, setProcessedTokensCount] = useState(LIMIT);
  const tokensRef = useRef<TokenType[]>([]);

  const snapshotInfo = useMemo(
    () => getActiveSnapshotInfo(activeSnapshotInfo),
    [activeSnapshotInfo]
  );

  const query = useMemo(() => {
    const fetchAllBlockchains =
      blockchainType.length === 2 || blockchainType.length === 0;

    const blockchain = fetchAllBlockchains ? null : blockchainType[0];

    if (snapshotInfo.isApplicable) {
      return createNftWithCommonOwnersSnapshotQuery({
        owners,
        blockchain: blockchain,
        blockNumber: snapshotInfo.blockNumber,
        date: snapshotInfo.date,
        timestamp: snapshotInfo.timestamp
      });
    }
    return createNftWithCommonOwnersQuery(owners, blockchain);
  }, [
    blockchainType,
    owners,
    snapshotInfo.isApplicable,
    snapshotInfo.blockNumber,
    snapshotInfo.date,
    snapshotInfo.timestamp
  ]);

  const isPoap = tokenType === 'POAP';
  const is6551 = tokenType === 'ERC6551';

  const [
    fetchTokens,
    {
      data: tokensData,
      pagination: { getNextPage, hasNextPage }
    }
  ] = useLazyQueryWithPagination(query, {}, config);

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
        fetchTokens({
          limit,
          tokenType: tokenFilters,
          blockNumber: snapshotInfo.blockNumber,
          date: snapshotInfo.date,
          timestamp: snapshotInfo.timestamp
        });
      } else {
        fetchTokens({
          limit,
          tokenType: tokenFilters,
          sortBy
        });
      }
    }

    setProcessedTokensCount(LIMIT);
  }, [
    fetchTokens,
    includeERC20,
    is6551,
    isPoap,
    owners,
    sortOrder,
    tokenType,
    snapshotInfo.isApplicable,
    snapshotInfo.blockNumber,
    snapshotInfo.date,
    snapshotInfo.timestamp
  ]);

  useEffect(() => {
    if (!tokensData) return;
    const { ethereum, polygon } = tokensData;
    let ethTokens = ethereum?.TokenBalance || [];
    let maticTokens = polygon?.TokenBalance || [];
    const processedTokenCount = ethTokens.length + maticTokens.length;
    setProcessedTokensCount(count => count + processedTokenCount);

    if (ethTokens.length > 0 && ethTokens[0]?.token?.tokenBalances) {
      ethTokens = ethTokens
        .filter((token: CommonTokenType) =>
          Boolean(token?.token?.tokenBalances?.length)
        )
        .map((token: CommonTokenType) => {
          token._common_tokens = token.token.tokenBalances || null;
          return token;
        }, []);
    }
    if (maticTokens.length > 0 && maticTokens[0]?.token?.tokenBalances) {
      maticTokens = maticTokens
        .filter((token: CommonTokenType) =>
          Boolean(token?.token?.tokenBalances?.length)
        )
        .map((token: CommonTokenType) => {
          token._common_tokens = token.token.tokenBalances || null;
          return token;
        }, []);
    }
    let tokens = [...ethTokens, ...maticTokens];

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

    tokensRef.current = [...tokensRef.current, ...tokens];
    onDataReceived(tokens);

    if (hasNextPage && tokensRef.current.length < LIMIT) {
      setLoading(true);
      getNextPage();
      return;
    }
    setLoading(false);
    tokensRef.current = [];
  }, [getNextPage, hasNextPage, is6551, onDataReceived, tokensData]);

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
