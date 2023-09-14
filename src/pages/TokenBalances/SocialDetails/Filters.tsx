import { FilterPlaceholder } from '../../../Components/Filters/FilterPlaceholder';
import { FilterCheckbox } from '../../../Components/Filters/FilterCheckbox';
import { useOutsideClick } from '../../../hooks/useOutsideClick';
import { useState, useCallback, ChangeEvent, useMemo, useEffect } from 'react';

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

const farcasterFollowOption = {
  label: 'also follows on farcaster',
  value: 'followsOnFarcaster'
};

const lensFollowOption = {
  label: 'also follows on lens',
  value: 'followsOnLens'
};

type FilterProps = {
  dappName?: string;
  selectedFilters: string[];
  onApply: (filters: string[]) => void;
};

const getSelectedFiltersInfo = (filters: string[]) => {
  const currentFilters: string[] = [];
  let followerCount = null;
  filters.forEach(filter => {
    if (filter.startsWith('moreThanNFollowers')) {
      const [, count] = filter.split(':');
      followerCount = count;
    } else {
      currentFilters.push(filter);
    }
  });
  return { currentFilters, followerCount };
};

export function Filters({ dappName, selectedFilters, onApply }: FilterProps) {
  const [currentFilters, setCurrentFilters] = useState<string[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const [followerCount, setFollowerCount] = useState<string | null>(null);

  const selectedFiltersInfo = useMemo(
    () => getSelectedFiltersInfo(selectedFilters),
    [selectedFilters]
  );

  useEffect(() => {
    setCurrentFilters(selectedFiltersInfo.currentFilters);
    setFollowerCount(selectedFiltersInfo.followerCount);
  }, [selectedFiltersInfo]);

  const filterOptions = useMemo(() => {
    if (dappName === 'lens') return [farcasterFollowOption, ...options];
    if (dappName === 'farcaster') return [lensFollowOption, ...options];
    return options;
  }, [dappName]);

  const handleDropdownHide = useCallback(() => {
    setIsDropdownVisible(false);
    setCurrentFilters(selectedFiltersInfo.currentFilters);
    setFollowerCount(selectedFiltersInfo.followerCount);
  }, [selectedFiltersInfo]);

  const dropdownContainerRef =
    useOutsideClick<HTMLDivElement>(handleDropdownHide);

  const handleDropdownToggle = useCallback(() => {
    setIsDropdownVisible(prevValue => !prevValue);
  }, []);

  const handleFollowerCountToggle = useCallback(() => {
    setFollowerCount(prev => (prev === null ? '1' : null));
  }, []);

  const handleFollowerCountChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setFollowerCount(event.target.value);
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
    if (followerCount != null) {
      _selectedFilters.push(`moreThanNFollowers:${followerCount}`);
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
            label="has more than 'n' followers"
            isSelected={followerCount !== null}
            onChange={handleFollowerCountToggle}
          />
          {followerCount != null && (
            <input
              autoFocus
              type="text"
              placeholder="enter value for n"
              className="bg-transparent border-b border-white ml-10 mr-4 mb-2 caret-white outline-none rounded-none"
              onChange={handleFollowerCountChange}
              value={followerCount}
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
