/* eslint-disable react-refresh/only-export-components */
import { useCallback, useEffect, useMemo } from 'react';
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
  const [
    { snapshotBlockNumber, snapshotDate, snapshotTimestamp, sortOrder },
    setData
  ] = useSearchInput();

  const isSnapshotQuery = Boolean(
    snapshotBlockNumber || snapshotDate || snapshotTimestamp
  );

  const isFilterDisabled = disabled || isSnapshotQuery;

  // Reset sort filter for snapshot query
  useEffect(() => {
    if (isFilterDisabled) {
      setData(
        {
          sortOrder: defaultSortOrder
        },
        { updateQueryParams: true }
      );
    }
  }, [isFilterDisabled, setData]);

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
      disabled={isFilterDisabled}
      selected={selected}
      onChange={handleChange}
      options={sortOptions}
      renderPlaceholder={(selected, isOpen, isDisabled) => (
        <FilterPlaceholder
          icon="sort"
          isOpen={isOpen}
          isDisabled={isDisabled}
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
