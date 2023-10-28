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
  defaultSnapshotFilter,
  getSnackbarMessage
} from './SnapshotFilter';
import { SortOrderType, defaultSortOrder, sortOptions } from './SortBy';
import {
  BlockchainFilterType,
  blockchainOptions,
  defaultBlockchainFilter
} from './BlockchainFilter';
import {
  getActiveSnapshotInfoString,
  getActiveSnapshotInfo
} from '../../utils/activeSnapshotInfoString';

const getAppliedFilterCount = ({
  appliedSnapshotFilter,
  appliedBlockchainFilter,
  appliedSortOrder
}: {
  appliedSnapshotFilter: SnapshotFilterType;
  appliedBlockchainFilter: BlockchainFilterType;
  appliedSortOrder: SortOrderType;
}) => {
  let count = 0;
  if (appliedSnapshotFilter != defaultSnapshotFilter) {
    count += 1;
  }
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

const filterInputClass =
  'bg-transparent border-b border-white ml-10 mr-4 mb-2 caret-white outline-none rounded-none';

const currentDate = new Date();

export function AllFilters() {
  const [searchInputs, setData] = useSearchInput();

  const address = searchInputs.address;
  const tokenType = searchInputs.tokenType;
  const activeSnapshotInfo = searchInputs.activeSnapshotInfo;
  const blockchainType = searchInputs.blockchainType as BlockchainFilterType[];
  const sortOrder = searchInputs.sortOrder as SortOrderType;

  const snapshotInfo = useMemo(
    () => getActiveSnapshotInfo(activeSnapshotInfo),
    [activeSnapshotInfo]
  );

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

  const [currentSnapshotFilter, setCurrentSnapshotFilter] = useState(
    snapshotInfo.appliedFilter
  );
  const [currentBlockchainFilter, setCurrentBlockchainFilter] = useState(
    appliedBlockchainFilter
  );
  const [currentSortOrder, setCurrentSortOrder] = useState(appliedSortOrder);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const [blockNumber, setBlockNumber] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [customDate, setCustomDate] = useState<DateValue>(currentDate);

  const handleDropdownHide = useCallback(() => {
    setIsDropdownVisible(false);
    setIsDatePickerVisible(false);
    setBlockNumber(snapshotInfo.blockNumber);
    setCustomDate(
      snapshotInfo.customDate ? new Date(snapshotInfo.customDate) : new Date()
    );
    setTimestamp(snapshotInfo.timestamp);
    setCurrentSnapshotFilter(snapshotInfo.appliedFilter);
    setCurrentBlockchainFilter(appliedBlockchainFilter);
    setCurrentSortOrder(appliedSortOrder);
  }, [
    snapshotInfo.blockNumber,
    snapshotInfo.customDate,
    snapshotInfo.timestamp,
    snapshotInfo.appliedFilter,
    appliedBlockchainFilter,
    appliedSortOrder
  ]);

  const dropdownContainerRef =
    useOutsideClick<HTMLDivElement>(handleDropdownHide);

  const datePickerContainerRef = useOutsideClick<HTMLDivElement>(() =>
    setIsDatePickerVisible(false)
  );

  const isPoap = tokenType === 'POAP';
  const isCombination = address.length > 1;

  useEffect(() => {
    const filterValues: Partial<CachedQuery> = {};
    // If snapshot query, reset sort filter
    if (snapshotInfo.isApplicable) {
      filterValues.sortOrder = defaultSortOrder;
    }
    // If POAP filter is applied, reset blockchain filter
    if (isPoap) {
      filterValues.blockchainType = [];
    }
    // If POAP and combinations, reset snapshot filter
    if (isPoap || isCombination) {
      filterValues.activeSnapshotInfo = undefined;
    }
    setData(filterValues, { updateQueryParams: true });
  }, [snapshotInfo.isApplicable, isPoap, isCombination, setData]);

  useEffect(() => {
    setCurrentSnapshotFilter(snapshotInfo.appliedFilter);
    setCurrentBlockchainFilter(appliedBlockchainFilter);
    setCurrentSortOrder(appliedSortOrder);
    setBlockNumber(snapshotInfo.blockNumber);
    setCustomDate(
      snapshotInfo.customDate ? new Date(snapshotInfo.customDate) : new Date()
    );
    setTimestamp(snapshotInfo.timestamp);
  }, [
    appliedBlockchainFilter,
    appliedSortOrder,
    snapshotInfo.appliedFilter,
    snapshotInfo.blockNumber,
    snapshotInfo.customDate,
    snapshotInfo.timestamp
  ]);

  const snackbarMessage = useMemo(
    () => getSnackbarMessage(snapshotInfo),
    [snapshotInfo]
  );

  const appliedFilterCount = useMemo(
    () =>
      getAppliedFilterCount({
        appliedSnapshotFilter: snapshotInfo.appliedFilter,
        appliedBlockchainFilter: appliedBlockchainFilter,
        appliedSortOrder: appliedSortOrder
      }),
    [snapshotInfo.appliedFilter, appliedBlockchainFilter, appliedSortOrder]
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
    setCurrentSnapshotFilter('customDate');
    setIsDatePickerVisible(true);
  }, []);

  const handleDatePickerShow = useCallback(() => {
    setIsDatePickerVisible(true);
  }, []);

  const handleDateChange = useCallback((newDate: DateValue) => {
    setCustomDate(newDate);
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
    const snapshotData: Record<string, string> = {};

    // For snapshot filter
    switch (currentSnapshotFilter) {
      case 'blockNumber':
        snapshotData.blockNumber = blockNumber;
        break;
      case 'customDate':
        snapshotData.customDate = (customDate as Date)
          .toISOString()
          .split('T')[0];
        break;
      case 'timestamp':
        snapshotData.timestamp = timestamp;
        break;
    }

    const filterValues: Partial<CachedQuery> = {
      activeSnapshotInfo: getActiveSnapshotInfoString(snapshotData)
    };

    // For blockchain filter
    if (currentBlockchainFilter === defaultBlockchainFilter) {
      filterValues.blockchainType = [];
    } else {
      filterValues.blockchainType = [currentBlockchainFilter];
    }

    // For sort filter
    // For snapshot query resetting sort order
    if (snapshotInfo.isApplicable) {
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
          isSelected={currentSnapshotFilter === 'today'}
          onClick={handleSnapshotFilterOptionClick('today')}
        />
        <FilterOption
          label="Custom date"
          isDisabled={isDisabled}
          isSelected={currentSnapshotFilter === 'customDate'}
          onClick={handleCustomDateOptionClick}
        />
        <div className="relative">
          {currentSnapshotFilter === 'customDate' && (
            <div
              className="ml-10 mr-4 mb-2 cursor-pointer"
              onClick={handleDatePickerShow}
            >
              {formattedDate}
            </div>
          )}
          {isDatePickerVisible && (
            <div ref={datePickerContainerRef} className="absolute left-2 z-20">
              <DatePicker
                value={customDate}
                maxDate={currentDate}
                onChange={handleDateChange}
              />
            </div>
          )}
        </div>
        <FilterOption
          label="Block number"
          isDisabled={isDisabled}
          isSelected={currentSnapshotFilter === 'blockNumber'}
          onClick={handleSnapshotFilterOptionClick('blockNumber')}
        />
        {currentSnapshotFilter === 'blockNumber' && (
          <input
            autoFocus
            type="text"
            placeholder="enter block no."
            className={filterInputClass}
            onChange={handleBlockNumberChange}
            onKeyUp={handleKeyboardKeyUp}
            value={blockNumber}
          />
        )}
        <FilterOption
          label="Timestamp"
          isDisabled={isDisabled}
          isSelected={currentSnapshotFilter === 'timestamp'}
          onClick={handleSnapshotFilterOptionClick('timestamp')}
        />
        {currentSnapshotFilter === 'timestamp' && (
          <input
            autoFocus
            type="text"
            placeholder="epoch timestamp"
            className={filterInputClass}
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
    const isDisabled = snapshotInfo.isApplicable;
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

  const formattedDate = customDate?.toLocaleString(undefined, {
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
          <div className="before-bg-glass before:zxw-[-1] before:rounded-18 p-1 mt-1 flex flex-col absolute min-w-[202px] left-0 top-full z-20">
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
      {snapshotInfo.appliedFilter !== defaultSnapshotFilter &&
        snackbarMessage && <SnapshotToastMessage message={snackbarMessage} />}
    </>
  );
}
