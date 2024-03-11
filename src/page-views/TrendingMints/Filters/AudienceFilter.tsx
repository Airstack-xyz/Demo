import { Dropdown } from '@/Components/Dropdown';
import { FilterOption } from '@/Components/Filters/FilterOption';
import { FilterPlaceholder } from '@/Components/Filters/FilterPlaceholder';
import { useSearchInput } from '@/hooks/useSearchInput';
import { useCallback, useMemo } from 'react';

export type AudienceFilterType =
  | 'farcaster' | "all";

export const defaultAudienceFilter: AudienceFilterType = 'farcaster';

type AudienceFilterOption = {
  label: string;
  value: AudienceFilterType;
};

export const audienceOptions: AudienceFilterOption[] = [
  {
    label: 'Farcaster only',
    value: 'farcaster'
  },
  {
    label: 'All',
    value: 'all'
  },
];

export function AudienceFilter({ disabled }: { disabled?: boolean }) {
  const [searchInputs, setData] = useSearchInput();

  const audience = searchInputs.audience || defaultAudienceFilter;

  const isFilterDisabled = disabled;

  const handleChange = useCallback(
    (selected: AudienceFilterOption[]) => {
      setData(
        {
          audience: selected[0].value
        },
        { updateQueryParams: true }
      );
    },
    [setData]
  );

  const selected = useMemo(() => {
    const option = audienceOptions.find(item => item.value === audience);
    if (option) {
      return [option];
    }
    return [audienceOptions[0]];
  }, [audience]);

  return (
    <Dropdown
      heading="Audience"
      optionsContainerClassName='min-w-[140px]'
      selected={selected}
      onChange={handleChange}
      options={audienceOptions}
      disabled={isFilterDisabled}
      renderPlaceholder={(selected, isOpen) => (
        <FilterPlaceholder
          icon="user"
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
