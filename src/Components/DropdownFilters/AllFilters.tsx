import classNames from 'classnames';
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { CachedQuery, useSearchInput } from '../../hooks/useSearchInput';
import { DatePicker, DateValue } from '../DatePicker';
import { Icon } from '../Icon';
import { FilterOption } from './FilterOption';
import { filterButtonClass } from './FilterPlaceholder';
import {
  SnapshotFilterType,
  SnapshotToastMessage,
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

export function AllFilters() {
  const [
    {
      snapshotBlockNumber,
      snapshotDate,
      snapshotTimestamp,
      blockchainType,
      tokenType,
      sortOrder
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

  const [blockNumber, setBlockNumber] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [date, setDate] = useState<DateValue>(new Date());

  const datePickerContainerRef = useOutsideClick(() =>
    setIsDatePickerVisible(false)
  );

  const containerRef = useRef<HTMLDivElement>(null);

  const isPoapFilterApplied = tokenType === 'POAP';

  useEffect(() => {
    // If POAP filter is applied, reset blockchain filter
    if (isPoapFilterApplied && blockchainType.length > 0) {
      setData(
        {
          blockchainType: []
        },
        { updateQueryParams: true }
      );
    }
  }, [blockchainType, isPoapFilterApplied, setData]);

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

  const handleDropdownHide = useCallback(() => {
    setIsDropdownVisible(false);
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

  const handleDropdownShow = useCallback(() => {
    setIsDropdownVisible(true);
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

  // Not enclosing in useCallback as its dependencies will change everytime
  const handleApplyClick = () => {
    const filterValues: Partial<CachedQuery> = {
      snapshotBlockNumber: undefined,
      snapshotDate: undefined,
      snapshotTimestamp: undefined
    };

    // For snapshot filter
    switch (currentSnapshotFilter) {
      case SnapshotFilterType.BLOCK_NUMBER:
        filterValues.snapshotBlockNumber = blockNumber;
        break;
      case SnapshotFilterType.CUSTOM_DATE:
        filterValues.snapshotDate = (date as Date).toISOString().split('T')[0];
        break;
      case SnapshotFilterType.TIMESTAMP:
        filterValues.snapshotTimestamp = timestamp;
        break;
    }

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

  const formattedDate = date?.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <>
      <div
        className="text-xs font-medium relative flex flex-col items-end"
        ref={containerRef}
      >
        <button
          className={classNames(filterButtonClass, {
            'border-white': isDropdownVisible
          })}
          onClick={handleDropdownShow}
        >
          Filters {appliedFilterCount > 0 ? `(${appliedFilterCount})` : ''}
          <Icon name="arrow-down" height={16} width={16} className="ml-1" />
        </button>
        {isDropdownVisible && (
          <div className="bg-glass rounded-18 p-1 mt-1 flex flex-col absolute min-w-[200px] left-0 top-full z-10">
            <div className="font-bold py-2 px-3.5 rounded-full text-left whitespace-nowrap">
              Balance as of
            </div>
            <FilterOption
              label="Today"
              isSelected={currentSnapshotFilter === SnapshotFilterType.TODAY}
              onClick={handleSnapshotFilterOptionClick(
                SnapshotFilterType.TODAY
              )}
            />
            <FilterOption
              label="Custom date"
              isSelected={
                currentSnapshotFilter === SnapshotFilterType.CUSTOM_DATE
              }
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
                <div
                  ref={datePickerContainerRef}
                  className="absolute left-2 z-20"
                >
                  <DatePicker value={date} onChange={handleDateChange} />
                </div>
              )}
            </div>
            <FilterOption
              label="Block number"
              isSelected={
                currentSnapshotFilter === SnapshotFilterType.BLOCK_NUMBER
              }
              onClick={handleSnapshotFilterOptionClick(
                SnapshotFilterType.BLOCK_NUMBER
              )}
            />
            {currentSnapshotFilter === SnapshotFilterType.BLOCK_NUMBER && (
              <input
                autoFocus
                type="text"
                placeholder="enter block no."
                className="bg-transparent border-b border-white ml-10 mr-4 mb-2 caret-white outline-none"
                onChange={handleBlockNumberChange}
                value={blockNumber}
              />
            )}
            <FilterOption
              label="Timestamp"
              isSelected={
                currentSnapshotFilter === SnapshotFilterType.TIMESTAMP
              }
              onClick={handleSnapshotFilterOptionClick(
                SnapshotFilterType.TIMESTAMP
              )}
            />
            {currentSnapshotFilter === SnapshotFilterType.TIMESTAMP && (
              <input
                autoFocus
                type="text"
                placeholder="epoch timestamp"
                className="bg-transparent border-b border-white ml-10 mr-4 mb-2 caret-white outline-none"
                onChange={handleTimestampChange}
                value={timestamp}
              />
            )}
            <div className="font-bold mt-2 py-2 px-3.5 rounded-full text-left whitespace-nowrap">
              Blockchain
            </div>
            {blockchainOptions.map(item => (
              <FilterOption
                label={item.label}
                isSelected={currentBlockchainFilter === item.value}
                onClick={handleBlockchainFilterOptionClick(item.value)}
              />
            ))}
            <div className="font-bold mt-2 py-2 px-3.5 rounded-full text-left whitespace-nowrap">
              Sort by
            </div>
            {sortOptions.map(item => (
              <FilterOption
                label={item.label}
                isSelected={currentSortOrder === item.value}
                onClick={handleSortOrderOptionClick(item.value)}
              />
            ))}
            <div className="p-2 mt-1 flex justify-between">
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
