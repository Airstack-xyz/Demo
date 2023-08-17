import { useCallback, memo, useMemo, useState, useEffect, useRef } from 'react';
import { PoapType, TokenType as TokenType } from './types';
import { useSearchInput } from '../../hooks/useSearchInput';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Token } from './Token';
import { useGetTokensOfOwner } from '../../hooks/useGetTokensOfOwner';
import { useGetPoapsOfOwner } from '../../hooks/useGetPoapsOfOwner';
import { StatusLoader } from '../TokenHolders/OverviewDetails/Tokens/StatusLoader';

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

function TokensComponent() {
  const [
    { address: owners, tokenType: tokenType = '', blockchainType, sortOrder }
  ] = useSearchInput();
  const [tokens, setTokens] = useState<(TokenType | PoapType)[]>([]);
  const visitedTokensSetRef = useRef<Set<string>>(new Set());

  const handleTokens = useCallback((tokens: (TokenType | PoapType)[]) => {
    const filteredTokens = tokens.filter(token => {
      const id = (token as PoapType).tokenId || token.tokenAddress;
      const duplicate = visitedTokensSetRef.current.has(id);
      visitedTokensSetRef.current.add(id);
      return !duplicate;
    });
    setTokens(existingTokens => [...existingTokens, ...filteredTokens]);
  }, []);

  useEffect(() => {
    // reset tokens when filters, sort or addresses change
    if (owners.length > 0) {
      setTokens([]);
      visitedTokensSetRef.current = new Set();
    }
  }, [blockchainType, owners, sortOrder, tokenType]);

  const {
    loading: loadingTokens,
    hasNextPage: hasNextPageTokens,
    processedTokensCount,
    getNext: getNextTokens
  } = useGetTokensOfOwner(handleTokens);

  const {
    loading: loadingPoaps,
    getNext: getNextPoaps,
    processedTokensCount: processedPoapsCount,
    hasNextPage: hasNextPagePoaps
  } = useGetPoapsOfOwner(handleTokens);

  const isPoap = tokenType === 'POAP';

  const canFetchPoap = useMemo(() => {
    const hasPolygonChainFilter =
      blockchainType.length === 1 && blockchainType[0] === 'polygon';
    return !hasPolygonChainFilter && (!tokenType || isPoap);
  }, [blockchainType, isPoap, tokenType]);

  const handleNext = useCallback(() => {
    if (!loadingTokens && !isPoap && hasNextPageTokens) {
      getNextTokens();
    }

    if (canFetchPoap && !loadingPoaps && hasNextPagePoaps) {
      getNextPoaps();
    }
  }, [
    canFetchPoap,
    getNextPoaps,
    getNextTokens,
    hasNextPagePoaps,
    hasNextPageTokens,
    isPoap,
    loadingPoaps,
    loadingTokens
  ]);

  const loading = loadingTokens || loadingPoaps;

  if (tokens.length === 0 && !loading) {
    return (
      <div className="flex flex-1 justify-center mt-10">No data found!</div>
    );
  }

  const hasNextPage = hasNextPageTokens || hasNextPagePoaps;
  const totalProcessed = processedTokensCount + processedPoapsCount;
  const showStatusLoader = loading && owners.length > 1;

  if (tokens.length === 0 && loading) {
    return (
      <div className="flex flex-wrap gap-x-[55px] gap-y-[55px] justify-center md:justify-start">
        <Loader />
        {showStatusLoader && (
          <StatusLoader matching={tokens.length} total={totalProcessed} />
        )}
      </div>
    );
  }

  return (
    <>
      <InfiniteScroll
        next={handleNext}
        dataLength={tokens.length}
        hasMore={hasNextPage}
        loader={null}
        className="flex flex-wrap gap-x-[55px] gap-y-[55px] justify-center md:justify-start mb-10"
      >
        {tokens.map((token, index) => {
          const id =
            (token as PoapType)?.tokenId ||
            (token as TokenType)?.tokenNfts?.tokenId;
          return (
            <div>
              <Token key={`${index}-${id}`} token={token} />
            </div>
          );
        })}
        {loading && <Loader />}
      </InfiniteScroll>
      {showStatusLoader && (
        <StatusLoader matching={tokens.length} total={totalProcessed} />
      )}
    </>
  );
}

export const Tokens = memo(TokensComponent);
