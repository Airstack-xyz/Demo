import { Dropdown } from '@/Components/Dropdown';
import { FilterOption } from '@/Components/Filters/FilterOption';
import { FilterPlaceholder } from '@/Components/Filters/FilterPlaceholder';
import { useSearchInput } from '@/hooks/useSearchInput';
import { useCallback, useMemo } from 'react';

export type TimeFrameFilterType =
  | 'one_hour'
  | 'two_hours'
  | 'eight_hours'
  | 'one_day'
  | 'two_days'
  | 'seven_days';

export const defaultTimeFrameFilter: TimeFrameFilterType = 'one_hour';

type TimeFrameFilterOption = {
  label: string;
  value: TimeFrameFilterType;
};

export const timeFrameOptions: TimeFrameFilterOption[] = [
  {
    label: '1 Hour',
    value: 'one_hour'
  },
  {
    label: '2 Hours',
    value: 'two_hours'
  },
  {
    label: '8 Hours',
    value: 'eight_hours'
  },
  {
    label: '1 Day',
    value: 'one_day'
  },
  {
    label: '2 Days',
    value: 'two_days'
  },
  {
    label: '7 Days',
    value: 'seven_days'
  }
];

export function TimeFrameFilter({ disabled }: { disabled?: boolean }) {
  const [searchInputs, setData] = useSearchInput();

  const timeFrame = searchInputs.timeFrame || defaultTimeFrameFilter;

  const isFilterDisabled = disabled;

  const handleChange = useCallback(
    (selected: TimeFrameFilterOption[]) => {
      setData(
        {
          timeFrame: selected[0].value
        },
        { updateQueryParams: true }
      );
    },
    [setData]
  );

  const selected = useMemo(() => {
    const option = timeFrameOptions.find(item => item.value === timeFrame);
    if (option) {
      return [option];
    }
    return [timeFrameOptions[0]];
  }, [timeFrame]);

  return (
    <Dropdown
      heading="Time frame"
      selected={selected}
      onChange={handleChange}
      options={timeFrameOptions}
      disabled={isFilterDisabled}
      renderPlaceholder={(selected, isOpen) => (
        <FilterPlaceholder
          icon="clock"
          isOpen={isOpen}
          isDisabled={isFilterDisabled}
          label={selected[0].label}
        />
      )}
      renderOption={({ option, isSelected, setSelected }) => (
        <FilterOption
          isSelected={isSelected}
          label={option.label}
          onClick={() => {
            setSelected([option]);
          }}
        />
      )}
    />
  );
}
