import { useCallback, memo, useMemo } from 'react';
import { PoapType, TokenType as TokenType } from './types';
import { useSearchInput } from '../../hooks/useSearchInput';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Token } from './Token';
import { useGetTokensOfOwner } from '../../hooks/useGetTokensOfOwner';
import { useGetPoapsOfOwner } from '../../hooks/useGetPoapsOfOwner';

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
  const [{ tokenType: tokenType = '', blockchainType }] = useSearchInput();

  const {
    tokens: tokensData,
    loading: loadingTokens,
    hasNextPage: hasNextPageTokens,
    getNext: getNextTokens
  } = useGetTokensOfOwner();

  const {
    tokens: poapsData,
    loading: loadingPoaps,
    getNext: getNextPoaps,
    hasNextPage: hasNextPagePoaps
  } = useGetPoapsOfOwner();

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
  const tokens = isPoap ? poapsData : tokensData;

  if (tokens.length === 0 && !loading) {
    return (
      <div className="flex flex-1 justify-center mt-10">No data found!</div>
    );
  }

  const hasNextPage = hasNextPageTokens || hasNextPagePoaps;
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
          (token as PoapType)?.tokenId ||
          (token as TokenType)?.tokenNfts?.tokenId;
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
