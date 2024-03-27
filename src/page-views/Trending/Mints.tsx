import { useQuery } from '@airstack/airstack-react';
import { TrendingHorizontalList } from './TrendingHorizontalList';
import {
  Audience,
  GetTrendingMintsQuery,
  GetTrendingMintsQueryVariables,
  TimeFrame,
  TrendingBlockchain,
  TrendingMintsCriteria
} from '../../../__generated__/airstack-types';
import { trendingMintsQuery } from '@/queries/trending/mints';
import { Mint } from '../TrendingMints/Mints/Mint';
import { TrendingMint } from './types';

const loaderData = Array.from({ length: 3 }).map((_, index) => ({}));

export function Mints() {
  const { data, loading } = useQuery<
    GetTrendingMintsQuery,
    GetTrendingMintsQueryVariables
  >(trendingMintsQuery, {
    audience: Audience.All,
    blockchain: TrendingBlockchain.Base,
    criteria: TrendingMintsCriteria.TotalMints,
    limit: 10,
    timeFrame: TimeFrame.SevenDays
  });

  const isLoading = loading || !data;
  const mints: TrendingMint[] = isLoading
    ? (loaderData as TrendingMint[])
    : data?.TrendingMints?.TrendingMint || [];

  return (
    <TrendingHorizontalList
      data={mints}
      getApiLink=""
      icon="trending-mints"
      onViewFrameClick={() => {}}
      onItemClick={() => {}}
      title="Trending Mints this week"
      viewAllLink=""
      renderItem={item =>
        isLoading ? (
          <div className="skeleton-loader ">
            <div
              className="size-72 bg-secondary rounded-18"
              data-loader-type="block"
            />
          </div>
        ) : (
          <Mint item={item} className="size-72" />
        )
      }
    />
  );
}
