/* eslint-disable react-refresh/only-export-components */
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useMatch } from 'react-router-dom';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { CachedQuery, useSearchInput } from '../../hooks/useSearchInput';
import { formatDate } from '../../utils';
import {
  SnapshotInfo,
  getActiveSnapshotInfo,
  getActiveSnapshotInfoString
} from '../../utils/activeSnapshotInfoString';
import { DatePicker, DateValue } from '../DatePicker';
import { Icon, IconType } from '../Icon';
import { FilterOption } from './FilterOption';
import { FilterPlaceholder } from './FilterPlaceholder';
import { defaultSortOrder } from './SortBy';

export type SnapshotFilterType =
  | 'today'
  | 'customDate'
  | 'blockNumber'
  | 'timestamp';

export const defaultSnapshotFilter: SnapshotFilterType = 'today';

export const getSnackbarMessage = (
  { appliedFilter, blockNumber, customDate, timestamp }: SnapshotInfo,
  isTokenBalancesPage = true
) => {
  let message = '';
  const page = isTokenBalancesPage ? 'balances' : 'holders';
  // TODO: Remove 'base' keyword when snapshot is released for other blockchains
  switch (appliedFilter) {
    case 'blockNumber':
      message = `Viewing base ${page} as of block no. ${blockNumber}`;
      break;
    case 'customDate':
      message = `Viewing base ${page} as of ${formatDate(customDate)}`;
      break;
    case 'timestamp':
      message = `Viewing base ${page} as of timestamp ${timestamp}`;
      break;
  }
  return message;
};

const getLabelAndIcon = ({
  appliedFilter,
  blockNumber,
  customDate,
  timestamp
}: SnapshotInfo) => {
  let label = 'Now';
  let icon: IconType = 'calendar';
  switch (appliedFilter) {
    case 'blockNumber':
      label = String(blockNumber);
      icon = 'block';
      break;
    case 'customDate':
      label = formatDate(customDate);
      icon = 'calendar';
      break;
    case 'timestamp':
      label = String(timestamp);
      icon = 'clock';
      break;
  }
  return { label, icon };
};

export function SnapshotTooltip({ message }: { message?: string }) {
  return (
    <div className="absolute left-4 top-4 z-20">
      <img src="images/cursor.svg" height={30} width={30} />
      <div className="bg-glass-1 rounded-[16px] py-1.5 px-3 w-max text-text-secondary">
        {message}
      </div>
    </div>
  );
}

export function SnapshotToast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 rounded-[30px] w-max py-2 px-5 flex bg-[#5398FF] text-sm font-semibold z-50">
      <Icon name="eye" height={20} width={20} className="mr-2" />
      {message}
    </div>
  );
}

const currentDate = new Date();

const filterInputClass =
  'bg-transparent border-b border-white ml-10 mr-4 mb-2 caret-white outline-none rounded-none';

export function SnapshotFilter({
  disabled,
  disabledTooltipMessage
}: {
  disabled?: boolean;
  disabledTooltipMessage?: string;
}) {
  const [{ activeSnapshotInfo }, setData] = useSearchInput();

  const isTokenBalancesPage = !!useMatch('/token-balances');

  const snapshotInfo = useMemo(
    () => getActiveSnapshotInfo(activeSnapshotInfo),
    [activeSnapshotInfo]
  );

  const [currentFilter, setCurrentFilter] = useState<SnapshotFilterType>(
    snapshotInfo.appliedFilter
  );

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const [blockNumber, setBlockNumber] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [customDate, setCustomDate] = useState<DateValue>(() =>
    snapshotInfo.customDate ? new Date(snapshotInfo.customDate) : new Date()
  );

  const handleTooltipShow = useCallback(() => {
    if (tooltipContainerRef.current) {
      tooltipContainerRef.current.style.display = 'block';
    }
  }, []);

  const handleTooltipHide = useCallback(() => {
    if (tooltipContainerRef.current) {
      tooltipContainerRef.current.style.display = 'none';
    }
  }, []);

  const handleTooltipMove = useCallback((event: React.MouseEvent) => {
    if (tooltipContainerRef.current && buttonContainerRef.current) {
      const rect = buttonContainerRef.current.getBoundingClientRect();
      const left = event.clientX - rect.left + 20;
      const top = event.clientY - rect.top - 3;
      tooltipContainerRef.current.style.left = `${left}px`;
      tooltipContainerRef.current.style.top = `${top}px`;
    }
  }, []);

  const handleDropdownHide = useCallback(() => {
    setIsDropdownVisible(false);
    setIsDatePickerVisible(false);
    setBlockNumber(snapshotInfo.blockNumber);
    setCustomDate(
      snapshotInfo.customDate ? new Date(snapshotInfo.customDate) : new Date()
    );
    setTimestamp(snapshotInfo.timestamp);
    setCurrentFilter(snapshotInfo.appliedFilter);
  }, [
    snapshotInfo.appliedFilter,
    snapshotInfo.blockNumber,
    snapshotInfo.customDate,
    snapshotInfo.timestamp
  ]);

  const dropdownContainerRef =
    useOutsideClick<HTMLDivElement>(handleDropdownHide);

  const datePickerContainerRef = useOutsideClick<HTMLDivElement>(() =>
    setIsDatePickerVisible(false)
  );

  const tooltipContainerRef = useRef<HTMLDivElement>(null);
  const buttonContainerRef = useRef<HTMLDivElement>(null);

  const enableTooltipHover = disabled && Boolean(disabledTooltipMessage);

  const isFilterDisabled = disabled;

  useEffect(() => {
    setBlockNumber(snapshotInfo.blockNumber);
    setCustomDate(
      snapshotInfo.customDate ? new Date(snapshotInfo.customDate) : new Date()
    );
    setTimestamp(snapshotInfo.timestamp);
    setCurrentFilter(snapshotInfo.appliedFilter);
  }, [
    snapshotInfo.appliedFilter,
    snapshotInfo.blockNumber,
    snapshotInfo.customDate,
    snapshotInfo.timestamp
  ]);

  const snackbarMessage = useMemo(
    () => getSnackbarMessage(snapshotInfo, isTokenBalancesPage),
    [isTokenBalancesPage, snapshotInfo]
  );

  const { label, icon } = useMemo(
    () => getLabelAndIcon(snapshotInfo),
    [snapshotInfo]
  );

  const handleDropdownToggle = useCallback(() => {
    setIsDropdownVisible(prevValue => !prevValue);
  }, []);

  const handleFilterOptionClick = useCallback(
    (filterType: SnapshotFilterType) => () => {
      setCurrentFilter(filterType);
    },
    []
  );

  const handleCustomDateOptionClick = useCallback(() => {
    setCurrentFilter('customDate');
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

    switch (currentFilter) {
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

    if (currentFilter !== 'today') {
      filterValues.sortOrder = defaultSortOrder; // for snapshot query reset sort order
      // TODO: Remove this blockchain restriction when snapshot is released for other blockchains
      filterValues.blockchainType = ['base'];
    } else {
      filterValues.blockchainType = [];
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
        <div
          className="relative"
          ref={buttonContainerRef}
          onMouseEnter={enableTooltipHover ? handleTooltipShow : undefined}
          onMouseLeave={enableTooltipHover ? handleTooltipHide : undefined}
          onMouseMove={enableTooltipHover ? handleTooltipMove : undefined}
        >
          <FilterPlaceholder
            isDisabled={isFilterDisabled}
            isOpen={isDropdownVisible}
            label={label}
            icon={icon}
            onClick={handleDropdownToggle}
          />
          <div
            ref={tooltipContainerRef}
            className="absolute hidden before-bg-glass-1 before:rounded-[16px] before:-z-10 rounded-[16px] py-1.5 px-3 w-max text-text-secondary z-[50]"
          >
            {disabledTooltipMessage}
          </div>
        </div>
        {isDropdownVisible && (
          <div className="before-bg-glass before:-z-10 before:rounded-18 p-1 mt-1 flex flex-col absolute min-w-[202px] left-0 top-full z-20">
            <div className="font-bold py-2 px-3.5 rounded-full text-left whitespace-nowrap">
              Balance as of
            </div>
            <FilterOption
              label="Now"
              isSelected={currentFilter === 'today'}
              onClick={handleFilterOptionClick('today')}
            />
            <FilterOption
              label="Custom date"
              isSelected={currentFilter === 'customDate'}
              onClick={handleCustomDateOptionClick}
            />
            <div className="relative">
              {currentFilter === 'customDate' && (
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
              isSelected={currentFilter === 'blockNumber'}
              onClick={handleFilterOptionClick('blockNumber')}
            />
            {currentFilter === 'blockNumber' && (
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
              isSelected={currentFilter === 'timestamp'}
              onClick={handleFilterOptionClick('timestamp')}
            />
            {currentFilter === 'timestamp' && (
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
