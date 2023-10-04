/* eslint-disable react-refresh/only-export-components */
import { useCallback, useEffect, useMemo } from 'react';
import { useSearchInput } from '../../hooks/useSearchInput';
import { Dropdown, Option } from '../Dropdown';
import { FilterOption } from './FilterOption';
import { FilterPlaceholder } from './FilterPlaceholder';

export type SortOrderType = 'DESC' | 'ASC';

export const defaultSortOrder = 'DESC';

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

export function SortBy({ disabled }: { disabled?: boolean }) {
  const [{ sortOrder }, setData] = useSearchInput();

  const isFilterDisabled = disabled;

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
    return sortOrder === 'ASC' ? [sortOptions[1]] : [sortOptions[0]];
  }, [sortOrder]);

  return (
    <Dropdown
      heading="Sort by"
      disabled={isFilterDisabled}
      selected={selected}
      onChange={handleChange}
      options={sortOptions}
      renderPlaceholder={(selected, isOpen) => (
        <FilterPlaceholder
          icon="sort"
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
      footerComponent={
        <div className="text-text-secondary text-[10px] pt-1 pb-2 pl-[30px] pr-2">
          *NFTs & POAPs will get sorted separately
        </div>
      }
    />
  );
}
