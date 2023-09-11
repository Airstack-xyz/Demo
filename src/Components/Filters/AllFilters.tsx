import classNames from 'classnames';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { CachedQuery, useSearchInput } from '../../hooks/useSearchInput';
import { DatePicker, DateValue } from '../DatePicker';
import { Icon } from '../Icon';
import { FilterOption } from './FilterOption';
import { filterPlaceholderClass } from './FilterPlaceholder';
import {
  SnapshotFilterType,
  SnapshotToastMessage,
  TextValue,
  defaultSnapshotFilter,
  getSnackbarMessage
} from './SnapshotFilter';
import { SortOrderType, defaultSortOrder, sortOptions } from './SortBy';
import {
  BlockchainFilterType,
  blockchainOptions,
  defaultBlockchainFilter
} from './BlockchainFilter';

const getAppliedFilterCount = ({
  selectedSnapshotFilter,
  selectedBlockchainFilter,
  selectedSortOrder
}: {
  selectedSnapshotFilter: SnapshotFilterType;
  selectedBlockchainFilter: BlockchainFilterType;
  selectedSortOrder: SortOrderType;
}) => {
  let count = 0;
  if (selectedSnapshotFilter != defaultSnapshotFilter) {
    count += 1;
  }
  if (selectedBlockchainFilter != defaultBlockchainFilter) {
    count += 1;
  }
  if (selectedSortOrder != defaultSortOrder) {
    count += 1;
  }
  return count;
};

const sectionHeaderClass =
  'font-bold py-2 px-3.5 rounded-full text-left whitespace-nowrap';

export function AllFilters() {
  const [
    {
      address,
      blockchainType,
      tokenType,
      sortOrder,
      snapshotBlockNumber,
      snapshotDate,
      snapshotTimestamp
    },
    setData
  ] = useSearchInput();

  const selectedSnapshotFilter = useMemo(() => {
    if (snapshotBlockNumber) return SnapshotFilterType.BLOCK_NUMBER;
    if (snapshotDate) return SnapshotFilterType.CUSTOM_DATE;
    if (snapshotTimestamp) return SnapshotFilterType.TIMESTAMP;
    return defaultSnapshotFilter;
  }, [snapshotBlockNumber, snapshotDate, snapshotTimestamp]);

  const selectedBlockchainFilter = useMemo(() => {
    const filterValue = blockchainType[0];
    if (
      filterValue === BlockchainFilterType.ETHEREUM ||
      filterValue === BlockchainFilterType.POLYGON
    ) {
      return filterValue;
    }
    return defaultBlockchainFilter;
  }, [blockchainType]);

  const selectedSortOrder = useMemo(() => {
    return sortOrder === SortOrderType.ASC
      ? SortOrderType.ASC
      : defaultSortOrder;
  }, [sortOrder]);

  const [currentSnapshotFilter, setCurrentSnapshotFilter] = useState(
    selectedSnapshotFilter
  );
  const [currentBlockchainFilter, setCurrentBlockchainFilter] = useState(
    selectedBlockchainFilter
  );
  const [currentSortOrder, setCurrentSortOrder] = useState(selectedSortOrder);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const [blockNumber, setBlockNumber] = useState<TextValue>('');
  const [timestamp, setTimestamp] = useState<TextValue>('');
  const [date, setDate] = useState<DateValue>(new Date());

  const handleDropdownHide = useCallback(() => {
    setIsDropdownVisible(false);
    setIsDatePickerVisible(false);
    setBlockNumber(snapshotBlockNumber);
    setDate(snapshotDate ? new Date(snapshotDate) : new Date());
    setTimestamp(snapshotTimestamp);
    setCurrentSnapshotFilter(selectedSnapshotFilter);
    setCurrentBlockchainFilter(selectedBlockchainFilter);
    setCurrentSortOrder(selectedSortOrder);
  }, [
    snapshotBlockNumber,
    snapshotDate,
    snapshotTimestamp,
    selectedSnapshotFilter,
    selectedBlockchainFilter,
    selectedSortOrder
  ]);

  const dropdownContainerRef =
    useOutsideClick<HTMLDivElement>(handleDropdownHide);

  const datePickerContainerRef = useOutsideClick<HTMLDivElement>(() =>
    setIsDatePickerVisible(false)
  );

  const isSnapshotQuery = Boolean(
    snapshotBlockNumber || snapshotDate || snapshotTimestamp
  );
  const isPoap = tokenType === 'POAP';
  const isCombination = address.length > 1;

  useEffect(() => {
    const filterValues: Partial<CachedQuery> = {};
    // If snapshot query, reset sort filter
    if (isSnapshotQuery) {
      filterValues.sortOrder = defaultSortOrder;
    }
    // If POAP filter is applied, reset blockchain filter
    if (isPoap) {
      filterValues.blockchainType = [];
    }
    // If POAP and combinations, reset snapshot filter
    if (isPoap || isCombination) {
      filterValues.snapshotBlockNumber = undefined;
      filterValues.snapshotDate = undefined;
      filterValues.snapshotTimestamp = undefined;
    }
    setData(filterValues, { updateQueryParams: true });
  }, [isSnapshotQuery, isPoap, isCombination, setData]);

  useEffect(() => {
    setCurrentSnapshotFilter(selectedSnapshotFilter);
    setCurrentBlockchainFilter(selectedBlockchainFilter);
    setCurrentSortOrder(selectedSortOrder);
    setBlockNumber(snapshotBlockNumber);
    setDate(snapshotDate ? new Date(snapshotDate) : new Date());
    setTimestamp(snapshotTimestamp);
  }, [
    selectedSnapshotFilter,
    selectedBlockchainFilter,
    selectedSortOrder,
    snapshotBlockNumber,
    snapshotDate,
    snapshotTimestamp
  ]);

  const snackbarMessage = useMemo(
    () =>
      getSnackbarMessage({
        selectedFilter: selectedSnapshotFilter,
        snapshotBlockNumber,
        snapshotDate,
        snapshotTimestamp
      }),
    [
      selectedSnapshotFilter,
      snapshotBlockNumber,
      snapshotDate,
      snapshotTimestamp
    ]
  );

  const appliedFilterCount = useMemo(
    () =>
      getAppliedFilterCount({
        selectedSnapshotFilter,
        selectedBlockchainFilter,
        selectedSortOrder
      }),
    [selectedBlockchainFilter, selectedSnapshotFilter, selectedSortOrder]
  );

  const handleDropdownToggle = useCallback(() => {
    setIsDropdownVisible(prevValue => !prevValue);
  }, []);

  const handleSnapshotFilterOptionClick = useCallback(
    (filterType: SnapshotFilterType) => () => {
      setCurrentSnapshotFilter(filterType);
    },
    []
  );

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

  const handleCustomDateOptionClick = useCallback(() => {
    setCurrentSnapshotFilter(SnapshotFilterType.CUSTOM_DATE);
    setIsDatePickerVisible(true);
  }, []);

  const handleDatePickerShow = useCallback(() => {
    setIsDatePickerVisible(true);
  }, []);

  const handleDateChange = useCallback((newDate: DateValue) => {
    setDate(newDate);
    setIsDatePickerVisible(false);
  }, []);

  const handleBlockNumberChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setBlockNumber(event.target.value);
    },
    []
  );

  const handleTimestampChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setTimestamp(event.target.value);
    },
    []
  );

  // Not enclosing in useCallback as its dependencies will change every time
  const handleApplyClick = () => {
    const filterValues: Partial<CachedQuery> = {
      snapshotBlockNumber: undefined,
      snapshotDate: undefined,
      snapshotTimestamp: undefined
    };

    // For snapshot filter
    switch (currentSnapshotFilter) {
      case SnapshotFilterType.BLOCK_NUMBER:
        filterValues.snapshotBlockNumber = blockNumber
          ? Number(blockNumber)
          : undefined;
        break;
      case SnapshotFilterType.CUSTOM_DATE:
        filterValues.snapshotDate = (date as Date).toISOString().split('T')[0];
        break;
      case SnapshotFilterType.TIMESTAMP:
        filterValues.snapshotTimestamp = timestamp
          ? Number(timestamp)
          : undefined;
        break;
    }

    // For blockchain filter
    if (currentBlockchainFilter === defaultBlockchainFilter) {
      filterValues.blockchainType = [];
    } else {
      filterValues.blockchainType = [currentBlockchainFilter];
    }

    // For sort filter
    // For snapshot query resetting sort order
    if (isSnapshotQuery) {
      filterValues.sortOrder = defaultSortOrder;
    } else {
      filterValues.sortOrder = currentSortOrder || defaultSortOrder;
    }

    setIsDropdownVisible(false);
    setData(filterValues, { updateQueryParams: true });
  };

  const handleKeyboardKeyUp = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      handleApplyClick();
    }
  };

  const renderSnapshotSection = () => {
    const isDisabled = isCombination || isPoap;
    return (
      <>
        <div
          className={classNames(sectionHeaderClass, {
            'opacity-50': isDisabled
          })}
        >
          Balance as of
        </div>
        <FilterOption
          label="Today"
          isDisabled={isDisabled}
          isSelected={currentSnapshotFilter === SnapshotFilterType.TODAY}
          onClick={handleSnapshotFilterOptionClick(SnapshotFilterType.TODAY)}
        />
        <FilterOption
          label="Custom date"
          isDisabled={isDisabled}
          isSelected={currentSnapshotFilter === SnapshotFilterType.CUSTOM_DATE}
          onClick={handleCustomDateOptionClick}
        />
        <div className="relative">
          {currentSnapshotFilter === SnapshotFilterType.CUSTOM_DATE && (
            <div
              className="ml-10 mr-4 mb-2 cursor-pointer"
              onClick={handleDatePickerShow}
            >
              {formattedDate}
            </div>
          )}
          {isDatePickerVisible && (
            <div ref={datePickerContainerRef} className="absolute left-2 z-20">
              <DatePicker value={date} onChange={handleDateChange} />
            </div>
          )}
        </div>
        <FilterOption
          label="Block number"
          isDisabled={isDisabled}
          isSelected={currentSnapshotFilter === SnapshotFilterType.BLOCK_NUMBER}
          onClick={handleSnapshotFilterOptionClick(
            SnapshotFilterType.BLOCK_NUMBER
          )}
        />
        {currentSnapshotFilter === SnapshotFilterType.BLOCK_NUMBER && (
          <input
            autoFocus
            type="text"
            placeholder="enter block no."
            className="bg-transparent border-b border-white ml-10 mr-4 mb-2 caret-white outline-none rounded-none"
            onChange={handleBlockNumberChange}
            onKeyUp={handleKeyboardKeyUp}
            value={blockNumber}
          />
        )}
        <FilterOption
          label="Timestamp"
          isDisabled={isDisabled}
          isSelected={currentSnapshotFilter === SnapshotFilterType.TIMESTAMP}
          onClick={handleSnapshotFilterOptionClick(
            SnapshotFilterType.TIMESTAMP
          )}
        />
        {currentSnapshotFilter === SnapshotFilterType.TIMESTAMP && (
          <input
            autoFocus
            type="text"
            placeholder="epoch timestamp"
            className="bg-transparent border-b border-white ml-10 mr-4 mb-2 caret-white outline-none rounded-none"
            onChange={handleTimestampChange}
            onKeyUp={handleKeyboardKeyUp}
            value={timestamp}
          />
        )}
      </>
    );
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
    const isDisabled = isSnapshotQuery;
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

  const formattedDate = date?.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

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
          <div className="before:bg-glass before:absolute before:inset-0 before:-z-10 before:rounded-18 p-1 mt-1 flex flex-col absolute min-w-[202px] left-0 top-full z-20">
            {renderSnapshotSection()}
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
      {selectedSnapshotFilter !== defaultSnapshotFilter && snackbarMessage && (
        <SnapshotToastMessage message={snackbarMessage} />
      )}
    </>
  );
}
