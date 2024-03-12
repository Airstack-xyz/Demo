import {
  TimeFrameFilter,
  defaultTimeFrameFilter
} from './Filters/TimeFrameFilter';
import {
  BlockchainFilter,
  defaultBlockchainFilter
} from './Filters/BlockchainFilter';
import {
  AudienceFilter,
  defaultAudienceFilter
} from './Filters/AudienceFilter';
import {
  CriteriaFilter,
  defaultCriteriaFilter
} from './Filters/CriteriaFilter';
import { useSearchInput } from '@/hooks/useSearchInput';
import { GetAPIDropdown } from '@/Components/GetAPIDropdown';
import { useDropdownOptions } from './hooks/useDropdownOptions';
import { Mints } from './Mints/Mints';
import { isMobileDevice } from '@/utils/isMobileDevice';
import { AllFilters } from './Filters/AllFilters';
import { ShareURLDropdown } from '@/Components/ShareURLDropdown';
import { TrendingMintsFrameModal } from '@/Components/Frames/TrendingMints';
import { Icon } from '@/Components/Icon';

export function TrendingMints() {
  const [searchInputs] = useSearchInput();

  const isMobile = isMobileDevice();

  const timeFrame = searchInputs.timeFrame || defaultTimeFrameFilter;
  const blockchain = searchInputs.blockchain || defaultBlockchainFilter;
  const audience = searchInputs.audience || defaultAudienceFilter;
  const criteria = searchInputs.criteria || defaultCriteriaFilter;

  const options = useDropdownOptions({
    timeFrame,
    blockchain,
    audience,
    criteria
  });

  return (
    <div className="max-w-[944px] mx-auto">
      <div className="flex items-center gap-1 font-bold text-white">
        <Icon name='trending-mints' />
        Trending Mints on <span className="capitalize">{blockchain}</span>
      </div>
      <div className="flex items-center justify-between gap-3.5 mt-5 mb-8">
        <div className="flex items-center gap-3.5">
          {isMobile ? (
            <AllFilters />
          ) : (
            <>
              <TimeFrameFilter />
              <BlockchainFilter />
              <AudienceFilter />
              <CriteriaFilter />
            </>
          )}
        </div>
        <div className="flex items-center gap-3.5">
          <GetAPIDropdown options={options} dropdownAlignment="right" />
          <ShareURLDropdown dropdownAlignment="right" />
          <TrendingMintsFrameModal />
        </div>
      </div>
      <Mints />
    </div>
  );
}
