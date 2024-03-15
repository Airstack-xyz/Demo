import { GetAPIDropdown } from '../../Components/GetAPIDropdown';
import { MAX_SEARCH_WIDTH } from '../../Components/Search/constants';
import { ShareURLDropdown } from '../../Components/ShareURLDropdown';
import { OnChainGraph } from './OnChainGraph';
import { Search } from './Search';
import { getAPIDropdownOptions } from './constants';

export function OnChainGraphPage() {
  return (
    <div className="content">
      <div style={{ maxWidth: MAX_SEARCH_WIDTH }} className="w-full">
        <Search />
        <div className="my-3 flex-row-center">
          <div className="flex justify-start gap-3.5 w-full z-[21]">
            <GetAPIDropdown
              options={getAPIDropdownOptions}
              dropdownAlignment="left"
              hideFooter
              hideDesktopNudge
            />
            <ShareURLDropdown dropdownAlignment="left" />
          </div>
        </div>
      </div>
      <OnChainGraph />
    </div>
  );
}
