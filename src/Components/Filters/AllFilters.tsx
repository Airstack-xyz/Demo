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

const getAppliedFilterCount = ({
  appliedBlockchainFilter,
  appliedSortOrder
}: {
  appliedBlockchainFilter: BlockchainFilterType;
  appliedSortOrder: SortOrderType;
}) => {
  let count = 0;
  if (appliedBlockchainFilter != defaultBlockchainFilter) {
    count += 1;
  }
  if (appliedSortOrder != defaultSortOrder) {
    count += 1;
  }
  return count;
};

const sectionHeaderClass =
  'font-bold py-2 px-3.5 rounded-full text-left whitespace-nowrap';

export function AllFilters() {
  const [{ address, blockchainType, tokenType, sortOrder }, setData] =
    useSearchInput();

  const appliedBlockchainFilter = useMemo(() => {
    const filterValue = blockchainType[0];
    if (
      filterValue === 'ethereum' ||
      filterValue === 'polygon' ||
      filterValue === 'base'
    ) {
      return filterValue;
    }
    return defaultBlockchainFilter;
  }, [blockchainType]);

  const appliedSortOrder = useMemo(() => {
    return sortOrder === 'ASC' ? 'ASC' : defaultSortOrder;
  }, [sortOrder]);

  const [currentBlockchainFilter, setCurrentBlockchainFilter] = useState(
    appliedBlockchainFilter
  );
  const [currentSortOrder, setCurrentSortOrder] = useState(appliedSortOrder);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleDropdownHide = useCallback(() => {
    setIsDropdownVisible(false);
    setCurrentBlockchainFilter(appliedBlockchainFilter);
    setCurrentSortOrder(appliedSortOrder);
  }, [appliedBlockchainFilter, appliedSortOrder]);

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
  }, [appliedBlockchainFilter, appliedSortOrder]);

  const appliedFilterCount = useMemo(
    () =>
      getAppliedFilterCount({
        appliedBlockchainFilter: appliedBlockchainFilter,
        appliedSortOrder: appliedSortOrder
      }),
    [appliedBlockchainFilter, appliedSortOrder]
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

    setIsDropdownVisible(false);
    setData(filterValues, { updateQueryParams: true });
  };

  const renderBlockchainSection = () => {
    const isDisabled = isPoap;
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
    return (
      <>
        <div className={sectionHeaderClass}>Sort by</div>
        {sortOptions.map(item => (
          <FilterOption
            key={item.value}
            label={item.label}
            isSelected={currentSortOrder === item.value}
            onClick={handleSortOrderOptionClick(item.value)}
          />
        ))}
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
