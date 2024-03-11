import { Dropdown } from '@/Components/Dropdown';
import { FilterOption } from '@/Components/Filters/FilterOption';
import { FilterPlaceholder } from '@/Components/Filters/FilterPlaceholder';
import { useSearchInput } from '@/hooks/useSearchInput';
import { useCallback, useMemo } from 'react';

export type BlockchainFilterType =
  | 'base';

export const defaultBlockchainFilter: BlockchainFilterType = 'base';

type BlockchainFilterOption = {
  label: string;
  value: BlockchainFilterType;
};

export const blockchainOptions: BlockchainFilterOption[] = [
  {
    label: 'Base',
    value: 'base'
  },
];

export function BlockchainFilter({ disabled }: { disabled?: boolean }) {
  const [searchInputs, setData] = useSearchInput();

  const blockchain = searchInputs.blockchain || defaultBlockchainFilter;

  const isFilterDisabled = disabled;

  const handleChange = useCallback(
    (selected: BlockchainFilterOption[]) => {
      setData(
        {
          blockchain: selected[0].value
        },
        { updateQueryParams: true }
      );
    },
    [setData]
  );

  const selected = useMemo(() => {
    const option = blockchainOptions.find(item => item.value === blockchain);
    if (option) {
      return [option];
    }
    return [blockchainOptions[0]];
  }, [blockchain]);

  return (
    <Dropdown
      heading="Blockchain"
      optionsContainerClassName='min-w-[120px]'
      selected={selected}
      onChange={handleChange}
      options={blockchainOptions}
      disabled={isFilterDisabled}
      renderPlaceholder={(selected, isOpen) => (
        <FilterPlaceholder
          icon="blockchain-filter"
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
