/* eslint-disable react-refresh/only-export-components */
import classNames from 'classnames';
import { useCallback, useMemo } from 'react';
import { useSearchInput } from '../../hooks/useSearchInput';
import { Dropdown, Option } from '../Dropdown';
import { FilterOption } from './FilterOption';
import { FilterPlaceholder } from './FilterPlaceholder';
import { TooltipWrapper } from './TooltipWrapper';

export type SortOrderType = 'DESC' | 'ASC';

export const defaultSortOrder: SortOrderType = 'DESC';

type SortOption = {
  label: string;
  value: SortOrderType;
};

export const sortOptions: SortOption[] = [
  {
    label: 'Newest transfer first',
    value: 'DESC'
  },
  {
    label: 'Oldest transfer first',
    value: 'ASC'
  }
];

export function SortBy({
  disabled,
  disabledTooltipText,
  descLabel = 'Newest transfer first',
  ascLabel = 'Oldest transfer first'
}: {
  disabled?: boolean;
  disabledTooltipText?: string;
  descLabel?: string;
  ascLabel?: string;
}) {
  const [searchInputs, setData] = useSearchInput();
  const options: SortOption[] = useMemo(() => {
    return [
      {
        label: descLabel,
        value: 'DESC'
      },
      {
        label: ascLabel,
        value: 'ASC'
      }
    ];
  }, [ascLabel, descLabel]);

  const sortOrder = searchInputs.sortOrder as SortOrderType;

  const enableTooltip = disabled && Boolean(disabledTooltipText);

  const isFilterDisabled = disabled;

  const handleChange = useCallback(
    (selected: Option[]) => {
      setData(
        {
          sortOrder: selected?.[0]?.value || defaultSortOrder
        },
        { updateQueryParams: true }
      );
    },
    [setData]
  );

  const selected = useMemo(() => {
    return sortOrder === 'ASC' ? [options[1]] : [options[0]];
  }, [options, sortOrder]);

  return (
    <Dropdown
      heading="Sort by"
      disabled={isFilterDisabled}
      selected={selected}
      onChange={handleChange}
      options={options}
      renderPlaceholder={(selected, isOpen) => (
        <TooltipWrapper
          tooltipEnabled={enableTooltip}
          tooltipText={disabledTooltipText}
        >
          <FilterPlaceholder
            icon="sort"
            isOpen={isOpen}
            isDisabled={isFilterDisabled}
            label={selected[0].label}
            className={classNames({
              'disabled:cursor-auto': enableTooltip // for not showing disabled cursor for tooltip
            })}
          />
        </TooltipWrapper>
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
