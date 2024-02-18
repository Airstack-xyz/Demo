import classNames from 'classnames';
import { GetAPIDropdown } from '../../Components/GetAPIDropdown';
import { MAX_SEARCH_WIDTH } from '../../Components/Search/constants';
import { ShareURLDropdown } from '../../Components/ShareURLDropdown';
import { OnChainGraph } from './OnChainGraph';
import { Search } from './Search';
import { getAPIDropdownOptions } from './constants';

export function OnChainGraphPage() {
  return (
    <div className={classNames('px-2 pt-5 max-w-[1440px] mx-auto sm:pt-8')}>
      <div style={{ maxWidth: MAX_SEARCH_WIDTH }} className="mx-auto w-full">
        <Search />
        <div className="my-3 flex-row-center">
          <div className="flex justify-center w-full z-[21]">
            <GetAPIDropdown
              options={getAPIDropdownOptions}
              dropdownAlignment="center"
              hideFooter
              hideDesktopNudge
            />
            <ShareURLDropdown dropdownAlignment="center" />
          </div>
        </div>
      </div>
      <OnChainGraph />
    </div>
  );
}
