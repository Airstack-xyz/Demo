import { Link } from '@/Components/Link';
import { HeadingWithIcon } from './HeadingWithIcon';
import { TrendingToken } from './types';
import { useQuery } from '@airstack/airstack-react';
import { trendingTokens } from '@/queries/trending/tokens';
import {
  GetTrendingTokensQuery,
  GetTrendingTokensQueryVariables,
  Audience,
  TrendingBlockchain,
  TrendingTokensCriteria,
  TrendingTokensTransferType,
  TimeFrame
} from '../../../__generated__/airstack-types';
import { TrendingTable } from './TrendingTable';

export function MemeCoins() {
  const { data, loading } = useQuery<
    GetTrendingTokensQuery,
    GetTrendingTokensQueryVariables
  >(trendingTokens, {
    audience: Audience.All,
    blockchain: TrendingBlockchain.Base,
    criteria: TrendingTokensCriteria.TotalTransfers,
    transferType: TrendingTokensTransferType.All,
    limit: 5,
    timeFrame: TimeFrame.SevenDays
  });

  const isLoading = loading || !data;
  const mints: TrendingToken[] = data?.TrendingTokens?.TrendingToken || [];

  return (
    <div>
      <div className="flex items-center">
        <HeadingWithIcon icon="trending-mints" title="Meme coins right now!" />
        <Link to="" className="text-xs font-medium text-text-button p-1 mt-1">
          View all {'->'}
        </Link>
      </div>
      <TrendingTable items={mints} loading={isLoading} />
    </div>
  );
}
