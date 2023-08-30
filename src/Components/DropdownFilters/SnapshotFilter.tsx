import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { FilterOption } from './FilterOption';
import { FilterPlaceholder } from './FilterPlaceholder';
import { Icon, IconType } from '../Icon';
import { DatePicker } from '../DatePicker';
import { CachedQuery, useSearchInput } from '../../hooks/useSearchInput';
import { useOutsideClick } from '../../hooks/useOutsideClick';

const enum SnapshotFilterType {
  TODAY = 'TODAY',
  CUSTOM_DATE = 'CUSTOM_DATE',
  BLOCK_NUMBER = 'BLOCK_NUMBER',
  TIMESTAMP = 'TIMESTAMP'
}

const filterTypeToLabel: Record<SnapshotFilterType, string> = {
  [SnapshotFilterType.TODAY]: 'Today',
  [SnapshotFilterType.CUSTOM_DATE]: 'Custom date',
  [SnapshotFilterType.BLOCK_NUMBER]: 'Block number',
  [SnapshotFilterType.TIMESTAMP]: 'Timestamp'
};

const filterTypeToIconMap: Record<SnapshotFilterType, IconType> = {
  [SnapshotFilterType.TODAY]: 'calendar',
  [SnapshotFilterType.CUSTOM_DATE]: 'calendar',
  [SnapshotFilterType.BLOCK_NUMBER]: 'block',
  [SnapshotFilterType.TIMESTAMP]: 'clock'
};

type DateInput = Date | null;

type DateValue = DateInput | [DateInput, DateInput];

const getSnackbarMessage = ({
  snapshotBlockNumber,
  snapshotDate,
  snapshotTimestamp
}: {
  snapshotBlockNumber: string;
  snapshotDate: string;
  snapshotTimestamp: string;
}) => {
  if (snapshotBlockNumber) {
    return `Viewing balances as of block no. ${snapshotBlockNumber}`;
  }
  if (snapshotDate) {
    const formattedDate = new Date(snapshotDate)?.toLocaleString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    return `Viewing holders as of ${formattedDate}`;
  }
  if (snapshotTimestamp) {
    return `Viewing balances as of timestamp ${snapshotTimestamp}`;
  }
};

export function SnapshotFilter({ disabled }: { disabled?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedFilter, setSelectedFilter] = useState(
    SnapshotFilterType.TODAY
  );
  const [currentFilter, setCurrentFilter] = useState(SnapshotFilterType.TODAY);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const [blockNumber, setBlockNumber] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [date, setDate] = useState<DateValue>(new Date());

  const [{ snapshotBlockNumber, snapshotDate, snapshotTimestamp }, setData] =
    useSearchInput();

  const datePickerContainerRef = useOutsideClick(() =>
    setIsDatePickerVisible(false)
  );

  useEffect(() => {
    let selectedType = SnapshotFilterType.TODAY;
    if (snapshotBlockNumber) {
      selectedType = SnapshotFilterType.BLOCK_NUMBER;
      setBlockNumber(snapshotBlockNumber);
    } else if (snapshotDate) {
      selectedType = SnapshotFilterType.CUSTOM_DATE;
      setDate(new Date(snapshotDate));
    } else if (snapshotTimestamp) {
      selectedType = SnapshotFilterType.TIMESTAMP;
      setTimestamp(snapshotTimestamp);
    }
    setSelectedFilter(selectedType);
    setCurrentFilter(selectedType);
  }, [snapshotBlockNumber, snapshotDate, snapshotTimestamp]);

  const handleDropdownHide = useCallback(() => {
    setIsDropdownVisible(false);
    setBlockNumber('');
    setTimestamp('');
    setCurrentFilter(selectedFilter);
  }, [selectedFilter]);

  const handleDropdownShow = useCallback(() => {
    setIsDropdownVisible(true);
  }, []);

  const handleFilterOptionClick = useCallback(
    (filterType: SnapshotFilterType) => () => {
      setCurrentFilter(filterType);
      setIsDatePickerVisible(false);
    },
    []
  );

  const handleCustomDateOptionClick = useCallback(() => {
    setCurrentFilter(SnapshotFilterType.CUSTOM_DATE);
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

  const handleApplyClick = () => {
    const snapshotFilters: Partial<CachedQuery> = {
      snapshotBlockNumber: undefined,
      snapshotDate: undefined,
      snapshotTimestamp: undefined
    };

    switch (currentFilter) {
      case SnapshotFilterType.TODAY:
        break;
      case SnapshotFilterType.BLOCK_NUMBER:
        snapshotFilters.snapshotBlockNumber = blockNumber;
        break;
      case SnapshotFilterType.CUSTOM_DATE:
        snapshotFilters.snapshotDate = (date as Date)
          .toISOString()
          .split('T')[0];
        break;
      case SnapshotFilterType.TIMESTAMP:
        snapshotFilters.snapshotTimestamp = timestamp;
        break;
    }

    setSelectedFilter(currentFilter);
    setIsDropdownVisible(false);
    setBlockNumber('');
    setTimestamp('');
    setData(snapshotFilters, { updateQueryParams: true });
  };

  const formattedDate = date?.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const formattedSnackbarMessage = getSnackbarMessage({
    snapshotBlockNumber,
    snapshotDate,
    snapshotTimestamp
  });

  return (
    <>
      <div
        className="text-xs font-medium relative flex flex-col items-end"
        ref={containerRef}
      >
        <FilterPlaceholder
          disabled={disabled}
          isOpen={isDropdownVisible}
          label={filterTypeToLabel[selectedFilter]}
          icon={filterTypeToIconMap[selectedFilter]}
          onClick={handleDropdownShow}
        />
        {isDropdownVisible && (
          <div className="bg-glass rounded-18 p-1 mt-1 flex flex-col absolute min-w-[150px] left-0 top-9 z-10">
            <div className="font-bold py-2 px-3.5 rounded-full text-left whitespace-nowrap">
              Balance as of
            </div>
            <FilterOption
              label="today"
              isSelected={currentFilter === SnapshotFilterType.TODAY}
              onClick={handleFilterOptionClick(SnapshotFilterType.TODAY)}
            />
            <FilterOption
              label="custom date"
              isSelected={currentFilter === SnapshotFilterType.CUSTOM_DATE}
              onClick={handleCustomDateOptionClick}
            />
            <div className="relative">
              {currentFilter === SnapshotFilterType.CUSTOM_DATE && (
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
              label="block number"
              isSelected={currentFilter === SnapshotFilterType.BLOCK_NUMBER}
              onClick={handleFilterOptionClick(SnapshotFilterType.BLOCK_NUMBER)}
            />
            {currentFilter === SnapshotFilterType.BLOCK_NUMBER && (
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
              label="timestamp"
              isSelected={currentFilter === SnapshotFilterType.TIMESTAMP}
              onClick={handleFilterOptionClick(SnapshotFilterType.TIMESTAMP)}
            />
            {currentFilter === SnapshotFilterType.TIMESTAMP && (
              <input
                autoFocus
                type="text"
                placeholder="epoch timestamp"
                className="bg-transparent border-b border-white ml-10 mr-4 mb-2 caret-white outline-none"
                onChange={handleTimestampChange}
                value={timestamp}
              />
            )}
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
      {selectedFilter !== SnapshotFilterType.TODAY &&
        formattedSnackbarMessage && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 rounded-[30px] py-2 px-5 flex bg-[#5398FF] text-sm font-semibold z-50">
            <Icon name="eye" height={20} width={20} className="mr-2" />
            {formattedSnackbarMessage}
          </div>
        )}
    </>
  );
}
