import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createNftWithCommonOwnersQuery } from '../queries/nftWithCommonOwnersQuery';
import { UserInputs } from './useSearchInput';
import { defaultSortOrder } from '../Components/Filters/SortBy';
import { tokenTypes } from '../pages/TokenBalances/constants';
import { CommonTokenType, TokenType } from '../pages/TokenBalances/types';
import { useLazyQueryWithPagination } from '@airstack/airstack-react';

const LIMIT = 20;
const LIMIT_COMBINATIONS = 100;

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
  'address' | 'tokenType' | 'blockchainType' | 'sortOrder' | 'spamFilter'
> & {
  includeERC20?: boolean;
};
export function useGetTokensOfOwner(
  inputs: Inputs,
  onDataReceived: (tokens: TokenType[]) => void
) {
  const {
    address: owners,
    tokenType: tokenType = '',
    blockchainType,
    sortOrder,
    spamFilter,
    includeERC20
  } = inputs;
  const visitedTokensSetRef = useRef<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [processedTokensCount, setProcessedTokensCount] = useState(0);
  const tokensRef = useRef<TokenType[]>([]);
  const fetchAllBlockchains =
    blockchainType.length === 2 || blockchainType.length === 0;

  const query = useMemo(() => {
    return createNftWithCommonOwnersQuery(
      owners,
      fetchAllBlockchains ? null : blockchainType[0]
    );
  }, [blockchainType, fetchAllBlockchains, owners]);

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

    if (!tokenType || !isPoap) {
      setLoading(true);
      visitedTokensSetRef.current = new Set();
      tokensRef.current = [];
      fetchTokens({
        limit: owners.length > 1 ? LIMIT_COMBINATIONS : LIMIT,
        sortBy: sortOrder ? sortOrder : defaultSortOrder,
        tokenType:
          tokenType && tokenType.length > 0 && !is6551
            ? [tokenType]
            : tokenTypes.filter(
                tokenType => includeERC20 || tokenType !== 'ERC20'
              )
      });
    }

    setProcessedTokensCount(0);
  }, [
    blockchainType,
    fetchTokens,
    includeERC20,
    is6551,
    isPoap,
    owners,
    sortOrder,
    tokenType
  ]);

  useEffect(() => {
    if (!tokensData) return;
    const { ethereum, polygon } = tokensData;
    let ethTokens = ethereum?.TokenBalance || [];
    let maticTokens = polygon?.TokenBalance || [];
    const processedTokenCount = ethTokens.length + maticTokens.length;
    setProcessedTokensCount(count => count + processedTokenCount);

    ethTokens = processTokens(ethTokens);
    maticTokens = processTokens(maticTokens);

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
