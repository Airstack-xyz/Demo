import { Link } from '@/Components/Link';
import { HeadingWithIcon } from './HeadingWithIcon';
import { TrendingMint } from './types';
import { useQuery } from '@airstack/airstack-react';
import {
  Audience,
  TrendingBlockchain,
  TimeFrame,
  GetTrendingMintsQuery,
  GetTrendingMintsQueryVariables,
  TrendingMintsCriteria
} from '../../../__generated__/airstack-types';
import { TrendingTable } from './TrendingTable';
import { trendingMintsQuery } from '@/queries/trending/mints';

export function MintsNow() {
  const { data, loading } = useQuery<
    GetTrendingMintsQuery,
    GetTrendingMintsQueryVariables
  >(trendingMintsQuery, {
    audience: Audience.All,
    blockchain: TrendingBlockchain.Base,
    criteria: TrendingMintsCriteria.TotalMints,
    limit: 5,
    timeFrame: TimeFrame.SevenDays
  });

  const isLoading = loading || !data;
  const mints: TrendingMint[] = data?.TrendingMints?.TrendingMint || [];

  return (
    <div>
      <div className="flex items-center">
        <HeadingWithIcon icon="trending-mints" title="Mints right now!" />
        <Link to="" className="text-xs font-medium text-text-button p-1 mt-1">
          View all {'->'}
        </Link>
      </div>
      <TrendingTable items={mints} loading={isLoading} />
    </div>
  );
}
