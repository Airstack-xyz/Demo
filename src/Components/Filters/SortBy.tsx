/* eslint-disable react-refresh/only-export-components */
import { useCallback, useMemo } from 'react';
import { useSearchInput } from '../../hooks/useSearchInput';
import { Dropdown, Option } from '../Dropdown';
import { FilterOption } from './FilterOption';
import { FilterPlaceholder } from './FilterPlaceholder';

export const enum SortOrderType {
  DESC = 'DESC',
  ASC = 'ASC'
}

export const sortOptions = [
  {
    label: 'Newest transfer first',
    value: SortOrderType.DESC
  },
  {
    label: 'Oldest transfer first',
    value: SortOrderType.ASC
  }
];

export const defaultSortOrder = SortOrderType.DESC;

export function SortBy({ disabled }: { disabled?: boolean }) {
  const [{ sortOrder }, setData] = useSearchInput();

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
    return sortOrder === SortOrderType.ASC
      ? [sortOptions[1]]
      : [sortOptions[0]];
  }, [sortOrder]);

  return (
    <Dropdown
      heading="Sort by"
      disabled={disabled}
      selected={selected}
      onChange={handleChange}
      options={sortOptions}
      renderPlaceholder={(selected, isOpen, isDisabled) => (
        <FilterPlaceholder
          isOpen={isOpen}
          disabled={isDisabled}
          icon="sort"
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
