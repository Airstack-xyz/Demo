/* eslint-disable react-refresh/only-export-components */
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { useSearchInput } from '../../hooks/useSearchInput';
import { formatDate } from '../../utils';
import { DatePicker, DateValue } from '../DatePicker';
import { Icon, IconType } from '../Icon';
import { FilterOption } from './FilterOption';
import { FilterPlaceholder } from './FilterPlaceholder';
import { defaultSortOrder } from './SortBy';
import {
  getActiveSnapshotInfoString,
  getActiveSnapshotInfo
} from '../../utils/activeSnapshotInfoString';

export const enum SnapshotFilterType {
  TODAY = 'TODAY',
  CUSTOM_DATE = 'CUSTOM_DATE',
  BLOCK_NUMBER = 'BLOCK_NUMBER',
  TIMESTAMP = 'TIMESTAMP'
}

export const defaultSnapshotFilter = SnapshotFilterType.TODAY;

type FunctionParams = {
  appliedFilter: SnapshotFilterType;
  blockNumber?: number;
  date?: string;
  timestamp?: number;
};

export const getSnackbarMessage = ({
  appliedFilter,
  blockNumber,
  date,
  timestamp
}: FunctionParams) => {
  let message = '';
  switch (appliedFilter) {
    case SnapshotFilterType.BLOCK_NUMBER:
      message = `Viewing balances as of block no. ${blockNumber}`;
      break;
    case SnapshotFilterType.CUSTOM_DATE:
      message = `Viewing holders as of ${formatDate(date)}`;
      break;
    case SnapshotFilterType.TIMESTAMP:
      message = `Viewing balances as of timestamp ${timestamp}`;
      break;
  }
  return message;
};

const getLabelAndIcon = ({
  appliedFilter,
  blockNumber,
  date,
  timestamp
}: FunctionParams) => {
  let label = 'Today';
  let icon: IconType = 'calendar';
  switch (appliedFilter) {
    case SnapshotFilterType.BLOCK_NUMBER:
      label = String(blockNumber);
      icon = 'block';
      break;
    case SnapshotFilterType.CUSTOM_DATE:
      label = formatDate(date);
      icon = 'calendar';
      break;
    case SnapshotFilterType.TIMESTAMP:
      label = String(timestamp);
      icon = 'clock';
      break;
  }
  return { label, icon };
};

const getTooltipMessage = ({
  forCombination,
  forPoap
}: {
  forCombination?: boolean;
  forPoap?: boolean;
}) => {
  if (forCombination) return 'Snapshots is disabled for combinations';
  if (forPoap) return 'Snapshots is disabled for POAP';
  return '';
};

export function SnapshotToastMessage({ message }: { message: string }) {
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 rounded-[30px] w-max py-2 px-5 flex bg-[#5398FF] text-sm font-semibold z-50">
      <Icon name="eye" height={20} width={20} className="mr-2" />
      {message}
    </div>
  );
}

export type TextValue = string | number | undefined;

const currentDate = new Date();

const filterInputClass =
  'bg-transparent border-b border-white ml-10 mr-4 mb-2 caret-white outline-none rounded-none';

export function SnapshotFilter({ disabled }: { disabled?: boolean }) {
  const [{ address, tokenType, activeSnapshotInfo }, setData] =
    useSearchInput();

  const snapshotInfo = useMemo(
    () => getActiveSnapshotInfo(activeSnapshotInfo),
    [activeSnapshotInfo]
  );

  const [currentFilter, setCurrentFilter] = useState(
    snapshotInfo.appliedFilter
  );

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const [blockNumber, setBlockNumber] = useState<TextValue>('');
  const [timestamp, setTimestamp] = useState<TextValue>('');
  const [date, setDate] = useState<DateValue>(currentDate);

  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const handleTooltipShow = useCallback(() => {
    setIsTooltipVisible(true);
  }, []);

  const handleTooltipHide = useCallback(() => {
    setIsTooltipVisible(false);
  }, []);

  const handleDropdownHide = useCallback(() => {
    setIsDropdownVisible(false);
    setIsDatePickerVisible(false);
    setBlockNumber(snapshotInfo.blockNumber);
    setDate(snapshotInfo.date ? new Date(snapshotInfo.date) : new Date());
    setTimestamp(snapshotInfo.timestamp);
    setCurrentFilter(snapshotInfo.appliedFilter);
  }, [
    snapshotInfo.appliedFilter,
    snapshotInfo.blockNumber,
    snapshotInfo.date,
    snapshotInfo.timestamp
  ]);

  const dropdownContainerRef =
    useOutsideClick<HTMLDivElement>(handleDropdownHide);

  const datePickerContainerRef = useOutsideClick<HTMLDivElement>(() =>
    setIsDatePickerVisible(false)
  );

  const isCombination = address.length > 1;
  const isPoap = tokenType === 'POAP';

  const isFilterDisabled = disabled || isCombination || isPoap;

  // Reset snapshot filter for combinations and poaps
  useEffect(() => {
    if (isFilterDisabled) {
      setData(
        {
          activeSnapshotInfo: undefined
        },
        { updateQueryParams: true }
      );
    }
  }, [isFilterDisabled, setData]);

  useEffect(() => {
    setBlockNumber(snapshotInfo.blockNumber);
    setDate(snapshotInfo.date ? new Date(snapshotInfo.date) : new Date());
    setTimestamp(snapshotInfo.timestamp);
    setCurrentFilter(snapshotInfo.appliedFilter);
  }, [
    snapshotInfo.appliedFilter,
    snapshotInfo.blockNumber,
    snapshotInfo.date,
    snapshotInfo.timestamp
  ]);

  const snackbarMessage = useMemo(
    () => getSnackbarMessage(snapshotInfo),
    [snapshotInfo]
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

  // Not enclosing in useCallback as its dependencies will change every time
  const handleApplyClick = () => {
    const snapshotValues: Record<string, unknown> = {};

    switch (currentFilter) {
      case SnapshotFilterType.BLOCK_NUMBER:
        snapshotValues.blockNumber = blockNumber;
        break;
      case SnapshotFilterType.CUSTOM_DATE:
        snapshotValues.date = (date as Date).toISOString().split('T')[0];
        break;
      case SnapshotFilterType.TIMESTAMP:
        snapshotValues.timestamp = timestamp;
        break;
    }

    setIsDropdownVisible(false);
    setData(
      {
        sortOrder: defaultSortOrder, // for snapshot query resetting sort order
        activeSnapshotInfo: getActiveSnapshotInfoString(snapshotValues)
      },
      { updateQueryParams: true }
    );
  };

  const handleKeyboardKeyUp = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      handleApplyClick();
    }
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
        onMouseEnter={isFilterDisabled ? handleTooltipShow : undefined}
        onMouseLeave={isFilterDisabled ? handleTooltipHide : undefined}
      >
        <FilterPlaceholder
          isDisabled={isFilterDisabled}
          isOpen={isDropdownVisible}
          label={label}
          icon={icon}
          onClick={handleDropdownToggle}
        />
        {isFilterDisabled && isTooltipVisible && (
          <div className="absolute left-4 top-4 z-20">
            <img src="images/cursor.svg" height={30} width={30} />
            <div className="bg-glass-1 rounded-[16px] py-1.5 px-3 w-max text-text-secondary">
              {getTooltipMessage({
                forCombination: isCombination,
                forPoap: isPoap
              })}
            </div>
          </div>
        )}
        {isDropdownVisible && (
          <div className="before:bg-glass before:absolute before:inset-0 before:-z-10 before:rounded-18 p-1 mt-1 flex flex-col absolute min-w-[202px] left-0 top-full z-20">
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
                  <DatePicker
                    value={date}
                    maxDate={currentDate}
                    onChange={handleDateChange}
                  />
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
                className={filterInputClass}
                onChange={handleBlockNumberChange}
                onKeyUp={handleKeyboardKeyUp}
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
        snackbarMessage && <SnapshotToastMessage message={snackbarMessage} />}
    </>
  );
}
