import { Dropdown } from '@/Components/Dropdown';
import { FilterOption } from '@/Components/Filters/FilterOption';
import { FilterPlaceholder } from '@/Components/Filters/FilterPlaceholder';
import { useSearchInput } from '@/hooks/useSearchInput';
import { useCallback, useMemo } from 'react';

export type CriteriaFilterType =
  | 'unique_wallets' | "total_mints";

export const defaultCriteriaFilter: CriteriaFilterType = 'unique_wallets';

type CriteriaFilterOption = {
  label: string;
  value: CriteriaFilterType;
};

export const criteriaOptions: CriteriaFilterOption[] = [
  {
    label: 'Unique Wallets',
    value: 'unique_wallets'
  },
  {
    label: 'Total Mints',
    value: 'total_mints'
  },
];

export function CriteriaFilter({ disabled }: { disabled?: boolean }) {
  const [searchInputs, setData] = useSearchInput();

  const criteria = searchInputs.criteria || defaultCriteriaFilter;

  const isFilterDisabled = disabled;

  const handleChange = useCallback(
    (selected: CriteriaFilterOption[]) => {
      setData(
        {
          criteria: selected[0].value
        },
        { updateQueryParams: true }
      );
    },
    [setData]
  );

  const selected = useMemo(() => {
    const option = criteriaOptions.find(item => item.value === criteria);
    if (option) {
      return [option];
    }
    return [criteriaOptions[0]];
  }, [criteria]);

  return (
    <Dropdown
      heading="Criteria"
      selected={selected}
      onChange={handleChange}
      options={criteriaOptions}
      disabled={isFilterDisabled}
      renderPlaceholder={(selected, isOpen) => (
        <FilterPlaceholder
          icon="wallet"
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
