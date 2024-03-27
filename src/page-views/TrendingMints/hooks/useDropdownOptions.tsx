import { createAppUrlWithQuery } from '@/utils/createAppUrlWithQuery';
import { useMemo } from 'react';
import { Option } from '../../../Components/GetAPIDropdown';
import { trendingMintsQuery } from '@/queries/trending/mints';

export function useDropdownOptions({
  timeFrame,
  blockchain,
  audience,
  criteria
}: {
  timeFrame: string;
  blockchain: string;
  audience: string;
  criteria: string;
}) {
  return useMemo(() => {
    const getAPIOptions: Option[] = [];

    const trendingMintsLink = createAppUrlWithQuery(trendingMintsQuery, {
      timeFrame,
      blockchain,
      audience,
      criteria,
      limit: 50
    });

    getAPIOptions.push({
      label: 'Trending Mints',
      link: trendingMintsLink
    });

    return getAPIOptions;
  }, [audience, blockchain, criteria, timeFrame]);
}
