import { useQuery } from '@airstack/airstack-react';
import { TrendingHorizontalList } from './TrendingHorizontalList';
import {
  Audience,
  GetTrendingTokensQuery,
  GetTrendingTokensQueryVariables,
  TimeFrame,
  TrendingBlockchain,
  TrendingTokensCriteria,
  TrendingTokensTransferType
} from '../../../__generated__/airstack-types';
import { trendingTokens } from '../../queries/trending/tokens';
import { Token } from './Token';
import { TrendingToken } from './types';

const loaderData = Array.from({ length: 3 }).map((_, index) => ({}));

export function Tokens() {
  const { data, loading } = useQuery<
    GetTrendingTokensQuery,
    GetTrendingTokensQueryVariables
  >(trendingTokens, {
    audience: Audience.All,
    blockchain: TrendingBlockchain.Base,
    criteria: TrendingTokensCriteria.TotalTransfers,
    transferType: TrendingTokensTransferType.All,
    limit: 10,
    timeFrame: TimeFrame.SevenDays
  });

  const isLoading = loading || !data;
  const mints: TrendingToken[] = isLoading
    ? (loaderData as TrendingToken[])
    : data?.TrendingTokens?.TrendingToken || [];

  return (
    <TrendingHorizontalList
      data={mints}
      getApiLink=""
      icon="trending-mints"
      onViewFrameClick={() => {}}
      onItemClick={() => {}}
      title="Trending Tokens this week"
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
          <Token item={item} className="size-72" />
        )
      }
    />
  );
}
