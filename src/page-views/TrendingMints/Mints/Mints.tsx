import { useSearchInput } from '@/hooks/useSearchInput';
import { trendingMintsQuery } from '@/queries/trendingMints';
import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  GetTrendingMintsQuery
} from '../../../../__generated__/airstack-types';
import { defaultAudienceFilter } from '../Filters/AudienceFilter';
import { defaultBlockchainFilter } from '../Filters/BlockchainFilter';
import { defaultCriteriaFilter } from '../Filters/CriteriaFilter';
import { defaultTimeFrameFilter } from '../Filters/TimeFrameFilter';
import { Mint, MintItemLoader } from './Mint';
import { TrendingMint } from './types';

const loaderData = Array(6).fill({});

function MintsLoader() {
  return (
    <>
      {loaderData.map((_, index) => (
        <MintItemLoader key={index} />
      ))}
    </>
  );
}

const LIMIT = 30;

export function Mints() {
  const [items, setItems] = useState<TrendingMint[] | null>(null);

  const [searchInputs] = useSearchInput();

  const timeFrame = searchInputs.timeFrame || defaultTimeFrameFilter;
  const blockchain = searchInputs.blockchain || defaultBlockchainFilter;
  const audience = searchInputs.audience || defaultAudienceFilter;
  const criteria = searchInputs.criteria || defaultCriteriaFilter;

  const handleOnComplete = useCallback((data: GetTrendingMintsQuery) => {
    const items = data?.TrendingMints?.TrendingMint || [];
    setItems(prev => [...(prev || []), ...items]);
  }, []);

  const [fetchData, { loading, error, pagination: { hasNextPage, getNextPage} }] =
    useLazyQueryWithPagination<GetTrendingMintsQuery>(
      trendingMintsQuery,
      undefined,
      {
        onCompleted: handleOnComplete
      }
    );

  const handleFetchMore = useCallback(() => {
    if (!loading && hasNextPage && getNextPage) {
      getNextPage();
    }
  }, [getNextPage, hasNextPage, loading]);

  useEffect(() => {
    setItems(null);
    fetchData({
      timeFrame,
      blockchain,
      audience,
      criteria,
      limit: LIMIT
    });
  }, [audience, blockchain, criteria, fetchData, timeFrame]);

  const mintsLength = items?.length ?? 0;

  // Using items?.length here because first time tokens will null initially
  if (items?.length === 0 && !loading) {
    return (
      <div className="flex flex-1 justify-center mt-10">No data found!</div>
    );
  }

  if (mintsLength === 0 && loading) {
    return (
      <div className="flex flex-wrap gap-10 justify-center md:justify-start">
        <MintsLoader />
      </div>
    );
  }

  return (
    <div>
      <InfiniteScroll
        next={handleFetchMore}
        dataLength={mintsLength}
        hasMore={hasNextPage}
        loader={null}
        className="flex flex-wrap gap-10 justify-center md:justify-start"
      >
        {error && (
          <div className="p-2 text-center text-sm text-white w-full">
            Error while fetching data!
          </div>
        )}
        {items?.map((item, index) => {
          return (
            <Mint key={`${item.id}_${index}`} item={item} />
          );
        })}
        {loading && <MintsLoader />}
      </InfiniteScroll>
    </div>
  );
}
