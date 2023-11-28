import classNames from 'classnames';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { tokenBlockchains } from '../../constants';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { CachedQuery, useSearchInput } from '../../hooks/useSearchInput';
import {
  getActiveSnapshotInfo,
  getActiveSnapshotInfoString
} from '../../utils/activeSnapshotInfoString';
import { DatePicker, DateValue } from '../DatePicker';
import { Icon } from '../Icon';
import { ToggleSwitch } from '../ToggleSwitch';
import {
  BlockchainFilterType,
  blockchainOptions,
  defaultBlockchainFilter
} from './BlockchainFilter';
import { FilterOption } from './FilterOption';
import { filterPlaceholderClass } from './FilterPlaceholder';
import {
  SnapshotFilterType,
  SnapshotToast,
  defaultSnapshotFilter,
  getSnackbarMessage
} from './SnapshotFilter';
import { SortOrderType, defaultSortOrder, sortOptions } from './SortBy';
import { SpamFilterType, defaultSpamFilter } from './SpamFilter';

const getAppliedFilterCount = ({
  appliedSnapshotFilter,
  appliedBlockchainFilter,
  appliedSortOrder,
  appliedSpamFilter
}: {
  appliedSnapshotFilter: SnapshotFilterType;
  appliedBlockchainFilter: BlockchainFilterType;
  appliedSortOrder: SortOrderType;
  appliedSpamFilter: SpamFilterType;
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
  if (appliedSpamFilter != defaultSpamFilter) {
    count += 1;
  }
  return count;
};

const sectionHeaderClass =
  'font-bold py-2 px-3.5 rounded-full text-left whitespace-nowrap';

const filterInputClass =
  'bg-transparent border-b border-white ml-10 mr-4 mb-2 caret-white outline-none rounded-none';

const currentDate = new Date();

export function AllFilters({
  snapshotDisabled,
  blockchainDisabled,
  sortByDisabled,
  spamFilterDisabled
}: {
  snapshotDisabled?: boolean;
  blockchainDisabled?: boolean;
  sortByDisabled?: boolean;
  spamFilterDisabled?: boolean;
}) {
  const [searchInputs, setData] = useSearchInput();

  const activeSnapshotInfo = searchInputs.activeSnapshotInfo;
  const blockchainType = searchInputs.blockchainType as BlockchainFilterType[];
  const sortOrder = searchInputs.sortOrder as SortOrderType;
  const spamFilter = searchInputs.spamFilter as SpamFilterType;

  const snapshotInfo = useMemo(
    () => getActiveSnapshotInfo(activeSnapshotInfo),
    [activeSnapshotInfo]
  );

  const appliedBlockchainFilter = useMemo(() => {
    const filterValue = blockchainType[0];
    if (tokenBlockchains.find(item => item === filterValue)) {
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

  const [currentSnapshotFilter, setCurrentSnapshotFilter] = useState(
    snapshotInfo.appliedFilter
  );
  const [currentBlockchainFilter, setCurrentBlockchainFilter] = useState(
    appliedBlockchainFilter
  );
  const [currentSortOrder, setCurrentSortOrder] = useState(appliedSortOrder);
  const [currentSpamFilter, setCurrentSpamFilter] = useState(appliedSpamFilter);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const [blockNumber, setBlockNumber] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [customDate, setCustomDate] = useState<DateValue>(() =>
    snapshotInfo.customDate ? new Date(snapshotInfo.customDate) : new Date()
  );

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
    setCurrentSpamFilter(appliedSpamFilter);
  }, [
    snapshotInfo.blockNumber,
    snapshotInfo.customDate,
    snapshotInfo.timestamp,
    snapshotInfo.appliedFilter,
    appliedBlockchainFilter,
    appliedSortOrder,
    appliedSpamFilter
  ]);

  const dropdownContainerRef =
    useOutsideClick<HTMLDivElement>(handleDropdownHide);

  const datePickerContainerRef = useOutsideClick<HTMLDivElement>(() =>
    setIsDatePickerVisible(false)
  );

  useEffect(() => {
    setCurrentSnapshotFilter(snapshotInfo.appliedFilter);
    setCurrentBlockchainFilter(appliedBlockchainFilter);
    setCurrentSortOrder(appliedSortOrder);
    setCurrentSpamFilter(appliedSpamFilter);
    setBlockNumber(snapshotInfo.blockNumber);
    setCustomDate(
      snapshotInfo.customDate ? new Date(snapshotInfo.customDate) : new Date()
    );
    setTimestamp(snapshotInfo.timestamp);
  }, [
    appliedBlockchainFilter,
    appliedSortOrder,
    appliedSpamFilter,
    snapshotInfo.appliedFilter,
    snapshotInfo.blockNumber,
    snapshotInfo.customDate,
    snapshotInfo.timestamp
  ]);

  const snackbarMessage = useMemo(
    () => getSnackbarMessage(snapshotInfo, blockchainType),
    [blockchainType, snapshotInfo]
  );

  const appliedFilterCount = useMemo(
    () =>
      getAppliedFilterCount({
        appliedSnapshotFilter: snapshotInfo.appliedFilter,
        appliedBlockchainFilter: appliedBlockchainFilter,
        appliedSortOrder: appliedSortOrder,
        appliedSpamFilter: appliedSpamFilter
      }),
    [
      snapshotInfo.appliedFilter,
      appliedBlockchainFilter,
      appliedSortOrder,
      appliedSpamFilter
    ]
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

  const handleSpamFilterClick = useCallback(() => {
    setCurrentSpamFilter(prevValue => (prevValue === '1' ? '0' : '1'));
  }, []);

  // Not enclosing in useCallback as its dependencies will change every time
  const handleApplyClick = () => {
    const snapshotData: Record<string, string> = {};

    // For snapshot filter
    switch (currentSnapshotFilter) {
      case 'blockNumber':
        snapshotData.blockNumber = blockNumber;
        break;
      case 'customDate':
        {
          const date = customDate as Date;
          const dateString = `${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDate()}`;
          snapshotData.customDate = dateString;
        }
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

    // For snapshot filter
    if (currentSnapshotFilter !== 'today') {
      filterValues.sortOrder = defaultSortOrder; // for snapshot query reset sort order
      // TODO: Remove below blockchain restriction when snapshot is released for other blockchains
      filterValues.blockchainType = ['ethereum'];
    } else {
      filterValues.sortOrder = currentSortOrder || defaultSortOrder;
    }

    // For spam filter
    filterValues.spamFilter = currentSpamFilter || defaultSpamFilter;

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
    const isDisabled = snapshotDisabled;
    return (
      <>
        <div
          className={classNames(sectionHeaderClass, {
            'opacity-50': isDisabled
          })}
        >
          Balances as of
        </div>
        <FilterOption
          label="Now"
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
              onClick={isDisabled ? undefined : handleDatePickerShow}
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
        {currentSnapshotFilter === 'blockNumber' && !isDisabled && (
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
        {currentSnapshotFilter === 'timestamp' && !isDisabled && (
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
    const isDisabled = blockchainDisabled;
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
          <div className="before-bg-glass before:z-[-1] before:rounded-18 p-1 mt-1 flex flex-col absolute min-w-[202px] left-0 top-full z-20">
            {renderSnapshotSection()}
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
      {snapshotInfo.appliedFilter !== defaultSnapshotFilter &&
        snackbarMessage && <SnapshotToast message={snackbarMessage} />}
    </>
  );
}
