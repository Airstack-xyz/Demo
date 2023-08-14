import * as airstackReact from '@airstack/airstack-react';
import { config } from '@airstack/airstack-react/config';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createNftWithCommonOwnersQuery } from '../queries/nftWithCommonOwnersQuery';
import { useSearchInput } from './useSearchInput';
import { defaultSortOrder } from '../pages/TokenBalances/SortBy';
import { tokenTypes } from '../pages/TokenBalances/constants';
import { CommonTokenType, TokenType } from '../pages/TokenBalances/types';

const LIMIT = 200;
const LIMIT_DISPLAY_ITEMS = 20;

export function useGetTokensOfOwner() {
  const [tokens, setTokens] = useState<TokenType[]>([]);
  const [loading, setLoading] = useState(false);
  const tokensRef = useRef<TokenType[]>([]);
  const [
    { address: owners, tokenType: tokenType = '', blockchainType, sortOrder }
  ] = useSearchInput();
  const fetchAllBlockchains =
    blockchainType.length === 2 || blockchainType.length === 0;

  const query = useMemo(() => {
    return createNftWithCommonOwnersQuery(
      owners,
      fetchAllBlockchains ? null : blockchainType[0]
    );
  }, [blockchainType, fetchAllBlockchains, owners]);

  const isPoap = tokenType === 'POAP';
  const [
    fetchTokens,
    {
      data: tokensData,
      pagination: { getNextPage, hasNextPage }
    }
  ] = airstackReact.useLazyQueryWithPagination(query, {}, config);

  useEffect(() => {
    if (owners.length === 0) return;

    // // const hasPolygonChainFilter =
    //   blockchainType.length === 1 && blockchainType[0] === 'polygon';

    if (!tokenType || !isPoap) {
      setLoading(true);
      fetchTokens({
        limit: LIMIT,
        sortBy: sortOrder ? sortOrder : defaultSortOrder,
        tokenType:
          tokenType && tokenType.length > 0
            ? [tokenType]
            : tokenTypes.filter(tokenType => tokenType !== 'POAP')
      });
    }
    tokensRef.current = [];
    setTokens([]);
  }, [
    blockchainType,
    fetchTokens,
    isPoap,
    owners.length,
    sortOrder,
    tokenType
  ]);

  useEffect(() => {
    if (!tokensData) return;
    const { ethereum, polygon } = tokensData;
    let ethTokens = ethereum?.TokenBalance || [];
    let maticTokens = polygon?.TokenBalance || [];

    if (ethTokens.length > 0 && ethTokens[0]?.token?.tokenBalances) {
      ethTokens = ethTokens
        .filter(
          (token: CommonTokenType) => token.token.tokenBalances.length > 0
        )
        .reduce((items: TokenType[], token: CommonTokenType) => {
          items.push(token.token.tokenBalances[0]);
          //   token.token.tokenBalances.forEach(item => items.push(item));
          return items;
        }, []);
    }
    if (maticTokens.length > 0 && maticTokens[0]?.token?.tokenBalances) {
      maticTokens = maticTokens
        .filter(
          (token: CommonTokenType) => token.token.tokenBalances.length > 0
        )
        .reduce((items: TokenType[], token: CommonTokenType) => {
          items.push(token.token.tokenBalances[0]);
          //   token.token.tokenBalances.forEach(item => items.push(item));
          return items;
        }, []);
    }
    tokensRef.current = [...tokensRef.current, ...ethTokens, ...maticTokens];
    setTokens(tokensRef.current);
    if (hasNextPage && tokensRef.current.length < LIMIT_DISPLAY_ITEMS) {
      setLoading(true);
      getNextPage();
      return;
    }
    setLoading(false);
    tokensRef.current = [];
  }, [getNextPage, hasNextPage, tokensData]);

  const getNext = useCallback(() => {
    if (!hasNextPage) return;
    setLoading(true);
    tokensRef.current = [];
    getNextPage();
  }, [getNextPage, hasNextPage]);

  return useMemo(() => {
    return {
      tokens,
      loading,
      hasNextPage,
      getNext
    };
  }, [tokens, loading, hasNextPage, getNext]);
}
