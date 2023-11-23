import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { CachedQuery, useSearchInput } from '../../hooks/useSearchInput';
import { Icon } from '../Icon';
import {
  BlockchainFilterType,
  blockchainOptions,
  defaultBlockchainFilter
} from './BlockchainFilter';
import { FilterOption } from './FilterOption';
import { filterPlaceholderClass } from './FilterPlaceholder';
import { SortOrderType, defaultSortOrder, sortOptions } from './SortBy';
import { ToggleSwitch } from '../ToggleSwitch';
import { SpamFilterType, defaultSpamFilter } from './SpamFilter';

const getAppliedFilterCount = ({
  appliedBlockchainFilter,
  appliedSortOrder,
  appliedFilterSpam
}: {
  appliedBlockchainFilter: BlockchainFilterType;
  appliedSortOrder: SortOrderType;
  appliedFilterSpam: SpamFilterType;
}) => {
  let count = 0;
  if (appliedBlockchainFilter != defaultBlockchainFilter) {
    count += 1;
  }
  if (appliedSortOrder != defaultSortOrder) {
    count += 1;
  }
  if (appliedFilterSpam != defaultSpamFilter) {
    count += 1;
  }
  return count;
};

const sectionHeaderClass =
  'font-bold py-2 px-3.5 rounded-full text-left whitespace-nowrap';

export function AllFilters({
  blockchainDisabled,
  sortByDisabled,
  spamFilterDisabled
}: {
  blockchainDisabled?: boolean;
  sortByDisabled?: boolean;
  spamFilterDisabled?: boolean;
}) {
  const [searchInputs, setData] = useSearchInput();

  const address = searchInputs.address;
  const tokenType = searchInputs.tokenType;
  const blockchainType = searchInputs.blockchainType as BlockchainFilterType[];
  const sortOrder = searchInputs.sortOrder as SortOrderType;
  const spamFilter = searchInputs.spamFilter as SpamFilterType;

  const appliedBlockchainFilter = useMemo(() => {
    const filterValue = blockchainType[0];
    if (filterValue === 'ethereum' || filterValue === 'polygon') {
      return filterValue;
    }
    return defaultBlockchainFilter;
  }, [blockchainType]);

  const appliedSortOrder = useMemo(() => {
    return sortOrder === 'ASC' ? 'ASC' : defaultSortOrder;
  }, [sortOrder]);

  const appliedSpamFilter = useMemo(() => {
    return spamFilter === '0' ? '0' : defaultSpamFilter;
  }, [spamFilter]);

  const [currentBlockchainFilter, setCurrentBlockchainFilter] = useState(
    appliedBlockchainFilter
  );
  const [currentSortOrder, setCurrentSortOrder] = useState(appliedSortOrder);
  const [currentSpamFilter, setCurrentSpamFilter] = useState(appliedSpamFilter);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleDropdownHide = useCallback(() => {
    setIsDropdownVisible(false);
    setCurrentBlockchainFilter(appliedBlockchainFilter);
    setCurrentSortOrder(appliedSortOrder);
    setCurrentSpamFilter(appliedSpamFilter);
  }, [appliedBlockchainFilter, appliedSpamFilter, appliedSortOrder]);

  const dropdownContainerRef =
    useOutsideClick<HTMLDivElement>(handleDropdownHide);

  const isPoap = tokenType === 'POAP';
  const isCombination = address.length > 1;

  useEffect(() => {
    const filterValues: Partial<CachedQuery> = {};
    // If POAP filter is applied, reset blockchain filter
    if (isPoap) {
      filterValues.blockchainType = [];
    }
    setData(filterValues, { updateQueryParams: true });
  }, [isPoap, isCombination, setData]);

  useEffect(() => {
    setCurrentBlockchainFilter(appliedBlockchainFilter);
    setCurrentSortOrder(appliedSortOrder);
    setCurrentSpamFilter(appliedSpamFilter);
  }, [appliedBlockchainFilter, appliedSpamFilter, appliedSortOrder]);

  const appliedFilterCount = useMemo(
    () =>
      getAppliedFilterCount({
        appliedBlockchainFilter: appliedBlockchainFilter,
        appliedSortOrder: appliedSortOrder,
        appliedFilterSpam: appliedSpamFilter
      }),
    [appliedBlockchainFilter, appliedSpamFilter, appliedSortOrder]
  );

  const handleDropdownToggle = useCallback(() => {
    setIsDropdownVisible(prevValue => !prevValue);
  }, []);

  const handleBlockchainFilterOptionClick = useCallback(
    (filterType: BlockchainFilterType) => () => {
      setCurrentBlockchainFilter(filterType);
    },
    []
  );

  const handleSortOrderOptionClick = useCallback(
    (filterType: SortOrderType) => () => {
      setCurrentSortOrder(filterType);
    },
    []
  );

  const handleSpamFilterClick = useCallback(() => {
    setCurrentSpamFilter(prevValue => (prevValue === '1' ? '0' : '1'));
  }, []);

  // Not enclosing in useCallback as its dependencies will change every time
  const handleApplyClick = () => {
    const filterValues: Partial<CachedQuery> = {};

    // For blockchain filter
    if (currentBlockchainFilter === defaultBlockchainFilter) {
      filterValues.blockchainType = [];
    } else {
      filterValues.blockchainType = [currentBlockchainFilter];
    }

    // For sort filter
    filterValues.sortOrder = currentSortOrder || defaultSortOrder;

    // For spam filter
    filterValues.spamFilter = currentSpamFilter || defaultSpamFilter;

    setIsDropdownVisible(false);
    setData(filterValues, { updateQueryParams: true });
  };

  const renderBlockchainSection = () => {
    const isDisabled = isPoap || blockchainDisabled;
    return (
      <>
        <div
          className={classNames(sectionHeaderClass, {
            'opacity-50': isDisabled
          })}
        >
          Blockchain
        </div>
        {blockchainOptions.map(item => (
          <FilterOption
            key={item.value}
            label={item.label}
            isDisabled={isDisabled}
            isSelected={currentBlockchainFilter === item.value}
            onClick={handleBlockchainFilterOptionClick(item.value)}
          />
        ))}
      </>
    );
  };

  const renderSortSection = () => {
    const isDisabled = sortByDisabled;
    return (
      <>
        <div
          className={classNames(sectionHeaderClass, {
            'opacity-50': isDisabled
          })}
        >
          Sort by
        </div>
        {sortOptions.map(item => (
          <FilterOption
            key={item.value}
            label={item.label}
            isDisabled={isDisabled}
            isSelected={currentSortOrder === item.value}
            onClick={handleSortOrderOptionClick(item.value)}
          />
        ))}
      </>
    );
  };

  const renderSpamSection = () => {
    const isDisabled = spamFilterDisabled;
    const isChecked = currentSpamFilter !== '0';
    return (
      <>
        <ToggleSwitch
          className="py-2 px-3.5"
          label="Filter Spam"
          labelClassName="text-xs font-bold text-white"
          checked={isChecked}
          disabled={isDisabled}
          onClick={handleSpamFilterClick}
        />
      </>
    );
  };

  return (
    <>
      <div
        className="text-xs font-medium relative flex flex-col items-end"
        ref={dropdownContainerRef}
      >
        <button
          className={classNames(filterPlaceholderClass, {
            'border-white': isDropdownVisible
          })}
          onClick={handleDropdownToggle}
        >
          Filters {appliedFilterCount > 0 ? `(${appliedFilterCount})` : ''}
          <Icon name="arrow-down" height={16} width={16} className="ml-1" />
        </button>
        {isDropdownVisible && (
          <div className="before-bg-glass before:z-[-1] before:rounded-18 p-1 mt-1 flex flex-col absolute min-w-[202px] left-0 top-full z-20">
            {renderBlockchainSection()}
            {renderSortSection()}
            {renderSpamSection()}
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
    </>
  );
}
