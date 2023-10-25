import { FilterPlaceholder } from '../../../Components/Filters/FilterPlaceholder';
import { FilterCheckbox } from '../../../Components/Filters/FilterCheckbox';
import { useOutsideClick } from '../../../hooks/useOutsideClick';
import {
  useState,
  useCallback,
  ChangeEvent,
  useMemo,
  useEffect,
  ReactNode
} from 'react';
import {
  ALSO_FOLLOW_FILTER,
  MORE_THAN_N_FOLLOW_FILTER,
  MUTUAL_FOLLOW_FILTER
} from './utils';
import { showToast } from '../../../utils/showToast';
import { Icon } from '../../../Components/Icon';

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
    label: 'has XMTP',
    value: 'xmtp'
  }
];

const hasFarcasterOption = {
  label: 'has farcaster',
  value: 'farcaster'
};

const hasLensOption = {
  label: 'has lens',
  value: 'lens'
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
  customLeftComponent?: ReactNode;
  onApply: (filters: string[]) => void;
};

export function Filters({
  dappName,
  selectedFilters,
  isFollowerQuery,
  disabled,
  customLeftComponent,
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
    const followText = isFollowerQuery ? 'follows' : 'following';
    if (dappName === 'lens')
      return [
        {
          label: `has mutual ${followText}`,
          value: MUTUAL_FOLLOW_FILTER
        },
        {
          label: `also ${followText} on farcaster`,
          value: `${ALSO_FOLLOW_FILTER}:farcaster`
        },
        hasFarcasterOption,
        ...options
      ];
    if (dappName === 'farcaster')
      return [
        {
          label: `has mutual ${followText}`,
          value: MUTUAL_FOLLOW_FILTER
        },
        {
          label: `also ${followText} on lens`,
          value: `${ALSO_FOLLOW_FILTER}:lens`
        },
        hasLensOption,
        ...options
      ];
    return options;
  }, [dappName, isFollowerQuery]);

  const chipOptions = useMemo(
    () => filterOptions.filter(item => selectedFilters.includes(item.value)),
    [filterOptions, selectedFilters]
  );

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
    setFollowCount(prev => (prev === null ? '' : null));
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

  const handleFilterRemove = useCallback(
    (filter: string) => {
      const filters = selectedFilters.filter(item => item !== filter);
      onApply(filters);
    },
    [onApply, selectedFilters]
  );

  const handleApplyClick = () => {
    const filters = currentFilters;
    if (followCount != null) {
      if (!(Number(followCount) > 0)) {
        showToast("Value of 'n' should be positive integer", 'negative');
        return;
      }
      filters.push(`${MORE_THAN_N_FOLLOW_FILTER}:${followCount}`);
    }
    setIsDropdownVisible(false);
    onApply(filters);
  };

  const handleFilterCountKeyUp = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      handleApplyClick();
    }
  };

  const appliedFiltersCount = selectedFilters.length;

  const renderChips = () => {
    const count = selectedFiltersInfo.followCount;
    return (
      <div className="flex gap-2.5 overflow-auto pr-[50px] no-scrollbar">
        {count != null && (
          <div className="py-[7px] px-3 flex-shrink-0 bg-glass-1 rounded-full">
            {isFollowerQuery
              ? `has more than ${count} followers`
              : `has more than ${count} followings`}
            <button
              className="ml-2.5"
              onClick={() =>
                handleFilterRemove(`${MORE_THAN_N_FOLLOW_FILTER}:${count}`)
              }
            >
              <Icon name="close" height={10} width={10} />
            </button>
          </div>
        )}
        {chipOptions.map((item, index) => (
          <div
            className="py-[7px] px-3 flex-shrink-0 bg-glass-1 rounded-full"
            key={index}
          >
            {item.label}
            <button
              className="ml-2.5"
              onClick={() => handleFilterRemove(item.value)}
            >
              <Icon name="close" height={10} width={10} />
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderDropdown = () => {
    if (!isDropdownVisible) {
      return null;
    }
    return (
      <div className="bg-glass rounded-18 p-2 mt-1 flex flex-col absolute min-w-[202px] right-0 top-full z-20">
        <FilterCheckbox
          className="max-sm:py-1.5"
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
            onKeyUp={handleFilterCountKeyUp}
            value={followCount}
          />
        )}
        {filterOptions.map(item => (
          <FilterCheckbox
            className="max-sm:py-1.5"
            key={item.value}
            label={item.label}
            isSelected={currentFilters.includes(item.value)}
            onChange={handleFilterCheckboxChange(item.value)}
          />
        ))}
        <div className="p-2 mt-1 flex justify-center gap-5">
          <button
            type="button"
            className="px-2.5 py-1 rounded-full bg-white backdrop-blur-[66.63px] text-primary enabled:hover:opacity-60 disabled:hover:cursor-not-allowed disabled:opacity-50"
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
    );
  };

  return (
    <div className="flex my-4 mx-1">
      {customLeftComponent && <div className="mr-2">{customLeftComponent}</div>}
      <div className="grow text-xs text-text-secondary scroll-shadow-r max-sm:w-[calc(100%-106px)]">
        {renderChips()}
      </div>
      <div
        ref={dropdownContainerRef}
        className="ml-2 flex-shrink-0 relative flex flex-col items-end"
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
        {renderDropdown()}
      </div>
    </div>
  );
}
