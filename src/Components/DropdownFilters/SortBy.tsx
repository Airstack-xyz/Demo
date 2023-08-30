/* eslint-disable react-refresh/only-export-components */
import { useCallback, useMemo } from 'react';
import { useSearchInput } from '../../hooks/useSearchInput';
import { Dropdown, Option } from '../Dropdown';
import { FilterOption } from './FilterOption';
import { FilterPlaceholder } from './FilterPlaceholder';

const sortOptions = [
  {
    label: 'Newest transfer first',
    value: 'DESC'
  },
  {
    label: 'Oldest transfer first',
    value: 'ASC'
  }
];

export const defaultSortOrder = sortOptions[0].value;

export function SortBy() {
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
    const options = [];
    if (!sortOrder || sortOrder === defaultSortOrder) {
      options.push(sortOptions[0]);
    } else {
      options.push(sortOptions[1]);
    }
    return options;
  }, [sortOrder]);

  return (
    <Dropdown
      heading="Sort by"
      selected={selected}
      onChange={handleChange}
      options={sortOptions}
      renderPlaceholder={(selected, isOpen) => (
        <FilterPlaceholder
          isOpen={isOpen}
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
