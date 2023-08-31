import { useCallback, memo, useMemo, useState, useEffect } from 'react';
import { PoapType, TokenType as TokenType } from './types';
import { useSearchInput } from '../../hooks/useSearchInput';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Token } from './Token';
import { useGetTokensOfOwner } from '../../hooks/useGetTokensOfOwner';
import { useGetPoapsOfOwner } from '../../hooks/useGetPoapsOfOwner';
import { emit } from '../../utils/eventEmitter/eventEmitter';
import { TokenBalancesLoaderWithInfo } from './TokenBalancesLoaderWithInfo';
import { TokenCombination } from './TokenCombination';
import classNames from 'classnames';
import { ERC6551Details } from './ERC6551/ERC6551Details';

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

  const handleTokens = useCallback((tokens: (TokenType | PoapType)[]) => {
    setTokens(existingTokens => [...existingTokens, ...tokens]);
  }, []);

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

  useEffect(() => {
    if (owners.length === 0) return;
    // reset tokens when search input changes
    setTokens([]);
  }, [blockchainType, owners, sortOrder, tokenType]);

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

  useEffect(() => {
    const totalProcessedTokens =
      processedTokensCount + processedPoapsCount || 40;
    emit('token-balances:tokens', {
      matched: tokens.length,
      total: totalProcessedTokens,
      loading
    });
  }, [processedPoapsCount, processedTokensCount, tokens.length, loading]);

  return <ERC6551Details />;

  if (tokens.length === 0 && !loading) {
    return (
      <div className="flex flex-1 justify-center mt-10">No data found!</div>
    );
  }

  const hasCombination = owners.length > 1;
  const hasNextPage = hasNextPageTokens || hasNextPagePoaps;
  const showStatusLoader = loading && hasCombination;

  if (tokens.length === 0 && loading) {
    return (
      <div className="flex flex-wrap gap-x-[55px] gap-y-[55px] justify-center md:justify-start">
        <Loader />
        {showStatusLoader && <TokenBalancesLoaderWithInfo />}
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
        className={classNames(
          'flex flex-wrap justify-center md:justify-start mb-10',
          {
            'gap-x-[20px] gap-y-[20px]': hasCombination,
            'gap-x-[55px] gap-y-[55px]': !hasCombination
          }
        )}
      >
        {tokens.map((token, index) => {
          const id =
            (token as PoapType)?.tokenId ||
            (token as TokenType)?.tokenNfts?.tokenId;
          return hasCombination ? (
            <TokenCombination key={`${index}-${id}`} token={token} />
          ) : (
            <Token key={`${index}-${id}`} token={token} />
          );
        })}
        {loading && <Loader />}
      </InfiniteScroll>
      {showStatusLoader && <TokenBalancesLoaderWithInfo />}
    </>
  );
}

export const Tokens = memo(TokensComponent);
