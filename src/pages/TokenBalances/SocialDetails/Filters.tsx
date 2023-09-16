import { FilterPlaceholder } from '../../../Components/Filters/FilterPlaceholder';
import { FilterCheckbox } from '../../../Components/Filters/FilterCheckbox';
import { useOutsideClick } from '../../../hooks/useOutsideClick';
import { useState, useCallback, ChangeEvent, useMemo, useEffect } from 'react';
import { ALSO_FOLLOW_ON_FILTER, MORE_THAN_N_FOLLOW_FILTER } from './utils';

const options = [
  {
    label: 'has primary ENS',
    value: 'primaryEns'
  },
  {
    label: 'has ENS',
    value: 'ens'
  },
  {
    label: 'has Lens',
    value: 'lens'
  },
  {
    label: 'has Farcaster',
    value: 'farcaster'
  },
  {
    label: 'has XMTP',
    value: 'xmtp'
  }
];

const alsoFollowOnFarcasterOption = {
  label: 'also follows on farcaster',
  value: `${ALSO_FOLLOW_ON_FILTER}:farcaster`
};

const alsoFollowOnLensOption = {
  label: 'also follows on lens',
  value: `${ALSO_FOLLOW_ON_FILTER}:lens`
};

const getSelectedFiltersInfo = (filters: string[]) => {
  const currentFilters: string[] = [];
  let followCount = null;
  filters.forEach(filter => {
    if (filter.startsWith(MORE_THAN_N_FOLLOW_FILTER)) {
      const [, count] = filter.split(':');
      followCount = count;
    } else {
      currentFilters.push(filter);
    }
  });
  return { currentFilters, followCount };
};

type FilterProps = {
  dappName?: string;
  selectedFilters: string[];
  isFollowerQuery?: boolean;
  disabled?: boolean;
  onApply: (filters: string[]) => void;
};

export function Filters({
  dappName,
  selectedFilters,
  isFollowerQuery,
  disabled,
  onApply
}: FilterProps) {
  const [currentFilters, setCurrentFilters] = useState<string[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const [followCount, setFollowCount] = useState<string | null>(null);

  const selectedFiltersInfo = useMemo(
    () => getSelectedFiltersInfo(selectedFilters),
    [selectedFilters]
  );

  useEffect(() => {
    setCurrentFilters(selectedFiltersInfo.currentFilters);
    setFollowCount(selectedFiltersInfo.followCount);
  }, [selectedFiltersInfo]);

  const filterOptions = useMemo(() => {
    if (dappName === 'lens') return [alsoFollowOnFarcasterOption, ...options];
    if (dappName === 'farcaster') return [alsoFollowOnLensOption, ...options];
    return options;
  }, [dappName]);

  const handleDropdownHide = useCallback(() => {
    setIsDropdownVisible(false);
    setCurrentFilters(selectedFiltersInfo.currentFilters);
    setFollowCount(selectedFiltersInfo.followCount);
  }, [selectedFiltersInfo]);

  const dropdownContainerRef =
    useOutsideClick<HTMLDivElement>(handleDropdownHide);

  const handleDropdownToggle = useCallback(() => {
    setIsDropdownVisible(prevValue => !prevValue);
  }, []);

  const handleFollowCountToggle = useCallback(() => {
    setFollowCount(prev => (prev === null ? '1' : null));
  }, []);

  const handleFollowCountChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setFollowCount(event.target.value);
    },
    []
  );

  const handleFilterCheckboxChange = useCallback(
    (filter: string) => () => {
      setCurrentFilters(prev => {
        if (prev.includes(filter)) {
          return prev.filter(item => item !== filter);
        }
        return [...prev, filter];
      });
    },
    []
  );

  const handleApplyClick = () => {
    const _selectedFilters = currentFilters;
    if (followCount != null) {
      _selectedFilters.push(`${MORE_THAN_N_FOLLOW_FILTER}:${followCount}`);
    }
    onApply(_selectedFilters);
  };

  const appliedFiltersCount = selectedFilters?.length;

  return (
    <div
      ref={dropdownContainerRef}
      className="text-xs font-medium relative flex flex-col items-end"
    >
      <FilterPlaceholder
        isDisabled={disabled}
        isOpen={isDropdownVisible}
        label={
          appliedFiltersCount ? `Filters (${appliedFiltersCount})` : 'Filters'
        }
        icon="filter"
        onClick={handleDropdownToggle}
      />
      {isDropdownVisible && (
        <div className="bg-glass rounded-18 p-2 mt-1 flex flex-col absolute min-w-[202px] right-0 top-full z-20">
          <FilterCheckbox
            label={
              isFollowerQuery
                ? "has more than 'n' followers"
                : "has more than 'n' followings"
            }
            isSelected={followCount !== null}
            onChange={handleFollowCountToggle}
          />
          {followCount != null && (
            <input
              autoFocus
              type="text"
              placeholder="enter value for n"
              className="bg-transparent border-b border-white ml-10 mr-4 mb-2 caret-white outline-none rounded-none"
              onChange={handleFollowCountChange}
              value={followCount}
            />
          )}
          {filterOptions.map(item => (
            <FilterCheckbox
              key={item.value}
              label={item.label}
              isSelected={currentFilters.includes(item.value)}
              onChange={handleFilterCheckboxChange(item.value)}
            />
          ))}
          <div className="p-2 mt-1 flex justify-center gap-5">
            <button
              type="button"
              className="px-2.5 py-1 rounded-full bg-white backdrop-blur-[66.63px] text-primary hover:opacity-60"
              onClick={handleApplyClick}
            >
              Apply
            </button>
            <button
              type="button"
              className="px-2.5 py-1 rounded-full hover:opacity-60"
              onClick={handleDropdownHide}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
