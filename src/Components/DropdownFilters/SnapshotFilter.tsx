/* eslint-disable react-refresh/only-export-components */
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
import { Icon, IconType } from '../Icon';
import { FilterOption } from './FilterOption';
import { FilterPlaceholder } from './FilterPlaceholder';
import { formatDate } from '../../utils';

export const enum SnapshotFilterType {
  TODAY = 'TODAY',
  CUSTOM_DATE = 'CUSTOM_DATE',
  BLOCK_NUMBER = 'BLOCK_NUMBER',
  TIMESTAMP = 'TIMESTAMP'
}

export const defaultSnapshotFilter = SnapshotFilterType.TODAY;

type FunctionParams = {
  selectedFilter: SnapshotFilterType;
  snapshotBlockNumber: string;
  snapshotDate: string;
  snapshotTimestamp: string;
};

export const getSnackbarMessage = ({
  selectedFilter,
  snapshotBlockNumber,
  snapshotDate,
  snapshotTimestamp
}: FunctionParams) => {
  let message = '';
  switch (selectedFilter) {
    case SnapshotFilterType.BLOCK_NUMBER:
      message = `Viewing balances as of block no. ${snapshotBlockNumber}`;
      break;
    case SnapshotFilterType.CUSTOM_DATE:
      message = `Viewing holders as of ${formatDate(snapshotDate)}`;
      break;
    case SnapshotFilterType.TIMESTAMP:
      message = `Viewing balances as of timestamp ${snapshotTimestamp}`;
      break;
  }
  return message;
};

const getLabelAndIcon = ({
  selectedFilter,
  snapshotBlockNumber,
  snapshotDate,
  snapshotTimestamp
}: FunctionParams) => {
  let label = 'Today';
  let icon: IconType = 'calendar';
  switch (selectedFilter) {
    case SnapshotFilterType.BLOCK_NUMBER:
      label = snapshotBlockNumber;
      icon = 'block';
      break;
    case SnapshotFilterType.CUSTOM_DATE:
      label = formatDate(snapshotDate);
      icon = 'calendar';
      break;
    case SnapshotFilterType.TIMESTAMP:
      label = snapshotTimestamp;
      icon = 'clock';
      break;
  }
  return { label, icon };
};

export function SnapshotToastMessage({ message }: { message: string }) {
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 rounded-[30px] w-max py-2 px-5 flex bg-[#5398FF] text-sm font-semibold z-50">
      <Icon name="eye" height={20} width={20} className="mr-2" />
      {message}
    </div>
  );
}

export function SnapshotFilter({ disabled }: { disabled?: boolean }) {
  const [{ snapshotBlockNumber, snapshotDate, snapshotTimestamp }, setData] =
    useSearchInput();

  const selectedFilter = useMemo(() => {
    if (snapshotBlockNumber) return SnapshotFilterType.BLOCK_NUMBER;
    if (snapshotDate) return SnapshotFilterType.CUSTOM_DATE;
    if (snapshotTimestamp) return SnapshotFilterType.TIMESTAMP;
    return defaultSnapshotFilter;
  }, [snapshotBlockNumber, snapshotDate, snapshotTimestamp]);

  const [currentFilter, setCurrentFilter] = useState(selectedFilter);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const [blockNumber, setBlockNumber] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [date, setDate] = useState<DateValue>(new Date());

  const containerRef = useRef<HTMLDivElement>(null);

  const datePickerContainerRef = useOutsideClick(() =>
    setIsDatePickerVisible(false)
  );

  useEffect(() => {
    setBlockNumber(snapshotBlockNumber);
    setDate(snapshotDate ? new Date(snapshotDate) : new Date());
    setTimestamp(snapshotTimestamp);
    setCurrentFilter(selectedFilter);
  }, [selectedFilter, snapshotBlockNumber, snapshotDate, snapshotTimestamp]);

  const handleDropdownHide = useCallback(() => {
    setIsDropdownVisible(false);
    setBlockNumber(snapshotBlockNumber);
    setDate(snapshotDate ? new Date(snapshotDate) : new Date());
    setTimestamp(snapshotTimestamp);
    setCurrentFilter(selectedFilter);
  }, [selectedFilter, snapshotBlockNumber, snapshotDate, snapshotTimestamp]);

  const handleDropdownShow = useCallback(() => {
    setIsDropdownVisible(true);
  }, []);

  const handleFilterOptionClick = useCallback(
    (filterType: SnapshotFilterType) => () => {
      setCurrentFilter(filterType);
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

  // Not enclosing in useCallback as its dependencies will change everytime
  const handleApplyClick = () => {
    const filterValues: Partial<CachedQuery> = {
      snapshotBlockNumber: undefined,
      snapshotDate: undefined,
      snapshotTimestamp: undefined
    };

    switch (currentFilter) {
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

    setIsDropdownVisible(false);
    setData(filterValues, { updateQueryParams: true });
  };

  const snackbarMessage = useMemo(
    () =>
      getSnackbarMessage({
        selectedFilter,
        snapshotBlockNumber,
        snapshotDate,
        snapshotTimestamp
      }),
    [selectedFilter, snapshotBlockNumber, snapshotDate, snapshotTimestamp]
  );

  const { label, icon } = useMemo(
    () =>
      getLabelAndIcon({
        selectedFilter,
        snapshotBlockNumber,
        snapshotDate,
        snapshotTimestamp
      }),
    [selectedFilter, snapshotBlockNumber, snapshotDate, snapshotTimestamp]
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
        <FilterPlaceholder
          disabled={disabled}
          isOpen={isDropdownVisible}
          label={label}
          icon={icon}
          onClick={handleDropdownShow}
        />
        {isDropdownVisible && (
          <div className="bg-glass rounded-18 p-1 mt-1 flex flex-col absolute min-w-[150px] left-0 top-full z-10">
            <div className="font-bold py-2 px-3.5 rounded-full text-left whitespace-nowrap">
              Balance as of
            </div>
            <FilterOption
              label="Today"
              isSelected={currentFilter === SnapshotFilterType.TODAY}
              onClick={handleFilterOptionClick(SnapshotFilterType.TODAY)}
            />
            <FilterOption
              label="Custom date"
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
              label="Block number"
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
              label="Timestamp"
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
      {selectedFilter !== defaultSnapshotFilter && snackbarMessage && (
        <SnapshotToastMessage message={snackbarMessage} />
      )}
    </>
  );
}
