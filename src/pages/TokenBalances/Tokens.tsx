import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { POAPQuery } from '../../queries';
import { PoapType, TokenType as TokenType } from './types';
import { useSearchInput } from '../../hooks/useSearchInput';
import { tokenTypes } from './constants';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getTokensQuery } from '../../queries/tokensQuery';
import { defaultSortOrder } from './SortBy';
import { Token } from './Token';

const loaderData = Array(6).fill({ token: {}, tokenNfts: {} });

function Loader() {
  return (
    <>
      {loaderData.map((_, index) => (
        <div className="skeleton-loader" key={index}>
          <Token key={index} token={null} />
        </div>
      ))}
    </>
  );
}

type Poap = PoapType['Poaps']['Poap'][0];
const variables = {};
const config = {
  cache: false
};

function TokensComponent() {
  const [
    { address: owner, tokenType: tokenType = '', blockchainType, sortOrder }
  ] = useSearchInput();

  const fetchAllBlockchains =
    blockchainType.length === 2 || blockchainType.length === 0;

  const query = useMemo(() => {
    return getTokensQuery(fetchAllBlockchains ? null : blockchainType[0]);
  }, [blockchainType, fetchAllBlockchains]);

  const [
    fetchTokens,
    { data: tokensData, loading: loadingTokens, pagination: paginationTokens }
  ] = useLazyQueryWithPagination(query, variables, config);
  const [
    fetchPoaps,
    { data: poapsData, loading: loadingPoaps, pagination: paginationPoaps }
  ] = useLazyQueryWithPagination(POAPQuery, variables, config);

  const [tokens, setTokens] = useState<(TokenType | Poap)[]>([]);
  const isPoap = tokenType === 'POAP';

  const canFetchPoap = useMemo(() => {
    const hasPolygonChainFilter =
      blockchainType.length === 1 && blockchainType[0] === 'polygon';
    return !hasPolygonChainFilter && (!tokenType || isPoap);
  }, [blockchainType, isPoap, tokenType]);

  useEffect(() => {
    if (owner) {
      const hasPolygonChainFilter =
        blockchainType.length === 1 && blockchainType[0] === 'polygon';

      if (!tokenType || !isPoap) {
        fetchTokens({
          owner,
          limit: fetchAllBlockchains || !hasPolygonChainFilter ? 10 : 20,
          sortBy: sortOrder ? sortOrder : defaultSortOrder,
          tokenType:
            tokenType && tokenType.length > 0
              ? [tokenType]
              : tokenTypes.filter(tokenType => tokenType !== 'POAP')
        });
      }

      if (canFetchPoap) {
        fetchPoaps({
          owner,
          limit: isPoap ? 20 : 10,
          sortBy: sortOrder ? sortOrder : defaultSortOrder
        });
      }
      setTokens([]);
    }
  }, [
    blockchainType,
    canFetchPoap,
    fetchAllBlockchains,
    fetchPoaps,
    fetchTokens,
    isPoap,
    owner,
    sortOrder,
    tokenType
  ]);

  useEffect(() => {
    if (tokensData) {
      const { ethereum, polygon } = tokensData;
      const ethTokens = ethereum?.TokenBalance || [];
      const maticTokens = polygon?.TokenBalance || [];
      setTokens(tokens => [...tokens, ...ethTokens, ...maticTokens]);
    }
  }, [tokensData]);

  useEffect(() => {
    if (poapsData) {
      setTokens(tokens => [...tokens, ...(poapsData?.Poaps?.Poap || [])]);
    }
  }, [poapsData]);

  const handleNext = useCallback(() => {
    if (!loadingTokens && !isPoap && paginationTokens?.hasNextPage) {
      paginationTokens.getNextPage();
    }

    if (canFetchPoap && !loadingPoaps && paginationPoaps?.hasNextPage) {
      paginationPoaps.getNextPage();
    }
  }, [
    canFetchPoap,
    isPoap,
    loadingPoaps,
    loadingTokens,
    paginationPoaps,
    paginationTokens
  ]);

  const loading = loadingTokens || loadingPoaps;

  if (tokens.length === 0 && !loading) {
    return (
      <div className="flex flex-1 justify-center mt-10">No data found!</div>
    );
  }

  const hasNextPage =
    paginationTokens?.hasNextPage || paginationPoaps?.hasNextPage;
  if (tokens.length === 0 && loading) {
    return (
      <div className="flex flex-wrap gap-x-[55px] gap-y-[55px] justify-center md:justify-start">
        <Loader />
      </div>
    );
  }

  return (
    <InfiniteScroll
      next={handleNext}
      dataLength={tokens.length}
      hasMore={hasNextPage}
      loader={loading ? <Loader /> : null}
      className="flex flex-wrap gap-x-[55px] gap-y-[55px] justify-center md:justify-start mb-10"
    >
      {tokens.map((token, index) => {
        const id =
          (token as Poap)?.tokenId || (token as TokenType)?.tokenNfts?.tokenId;
        return (
          <div>
            <Token key={`${index}-${id}`} token={token} />
          </div>
        );
      })}
    </InfiniteScroll>
  );
}

export const Tokens = memo(TokensComponent);
