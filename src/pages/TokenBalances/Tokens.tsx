import { useCallback, memo, useMemo, useState, useEffect } from 'react';
import { PoapType, TokenType as TokenType } from './types';
import { UserInputs } from '../../hooks/useSearchInput';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Token } from './Token';
import { useGetTokensOfOwner } from '../../hooks/useGetTokensOfOwner';
import { useGetPoapsOfOwner } from '../../hooks/useGetPoapsOfOwner';
import { emit } from '../../utils/eventEmitter/eventEmitter';
import { TokenBalancesLoaderWithInfo } from './TokenBalancesLoaderWithInfo';
import { TokenCombination } from './TokenCombination';
import classNames from 'classnames';
import { TokenWithERC6551 } from './TokenWithERC6551';

const loaderData = Array(6).fill({ token: {}, tokenNfts: {} });

export function TokensLoader() {
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

type TokenProps = Pick<
  UserInputs,
  | 'address'
  | 'tokenType'
  | 'blockchainType'
  | 'sortOrder'
  | 'activeSnapshotInfo'
> & {
  poapDisabled?: boolean;
  includeERC20?: boolean;
};
function TokensComponent(props: TokenProps) {
  const {
    address: owners,
    tokenType: tokenType = '',
    blockchainType,
    sortOrder,
    activeSnapshotInfo,
    includeERC20,
    poapDisabled
  } = props;
  const [tokens, setTokens] = useState<(TokenType | PoapType)[]>([]);

  const handleTokens = useCallback((tokens: (TokenType | PoapType)[]) => {
    setTokens(existingTokens => [...existingTokens, ...tokens]);
  }, []);

  const inputs = {
    address: owners,
    tokenType,
    blockchainType,
    sortOrder,
    activeSnapshotInfo,
    includeERC20
  };

  const {
    loading: loadingTokens,
    hasNextPage: hasNextPageTokens,
    processedTokensCount,
    getNext: getNextTokens
  } = useGetTokensOfOwner(inputs, handleTokens);

  const {
    loading: loadingPoaps,
    getNext: getNextPoaps,
    processedTokensCount: processedPoapsCount,
    hasNextPage: hasNextPagePoaps
  } = useGetPoapsOfOwner(inputs, handleTokens, poapDisabled);

  useEffect(() => {
    if (owners.length === 0) return;
    // reset tokens when search input changes
    setTokens([]);
  }, [blockchainType, owners, sortOrder, tokenType]);

  const isPoap = tokenType === 'POAP';

  const canFetchPoap = useMemo(() => {
    const hasPolygonOrBaseChainFilter =
      blockchainType.length === 1 &&
      (blockchainType[0] === 'polygon' || blockchainType[0] === 'base');
    return (
      !hasPolygonOrBaseChainFilter && !poapDisabled && (!tokenType || isPoap)
    );
  }, [blockchainType, isPoap, poapDisabled, tokenType]);

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
      <div>
        <div className="flex flex-wrap gap-x-[55px] gap-y-[55px] justify-center md:justify-start">
          <TokensLoader />
          {showStatusLoader && <TokenBalancesLoaderWithInfo />}
        </div>
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

          if (hasCombination) {
            return <TokenCombination key={`${index}-${id}`} token={token} />;
          }

          const hasERC6551 =
            (token as TokenType)?.tokenNfts?.erc6551Accounts?.length > 0;

          if (hasERC6551) {
            return <TokenWithERC6551 key={`${index}-${id}`} token={token} />;
          }

          return <Token key={`${index}-${id}`} token={token} />;
        })}
        {loading && <TokensLoader />}
      </InfiniteScroll>
      {showStatusLoader && <TokenBalancesLoaderWithInfo />}
    </>
  );
}

export const Tokens = memo(TokensComponent);
