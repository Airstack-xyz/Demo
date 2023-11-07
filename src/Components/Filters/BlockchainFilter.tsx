/* eslint-disable react-refresh/only-export-components */
import { useCallback, useMemo } from 'react';
import { useSearchInput } from '../../hooks/useSearchInput';
import { Dropdown, Option } from '../Dropdown';
import { FilterOption } from './FilterOption';
import { FilterPlaceholder } from './FilterPlaceholder';

export type BlockchainFilterType = 'all' | 'ethereum' | 'polygon' | 'base';

export const defaultBlockchainFilter: BlockchainFilterType = 'all';

type BlockchainOption = {
  label: string;
  value: BlockchainFilterType;
};

export const blockchainOptions: BlockchainOption[] = [
  {
    label: 'All chains',
    value: 'all'
  },
  {
    label: 'Ethereum',
    value: 'ethereum'
  },
  {
    label: 'Polygon',
    value: 'polygon'
  },
  {
    label: 'Base',
    value: 'base'
  }
];

export function BlockchainFilter({ disabled }: { disabled?: boolean }) {
  const [searchInputs, setData] = useSearchInput();

  const blockchainType = searchInputs.blockchainType as BlockchainFilterType[];

  const isFilterDisabled = disabled;

  const handleChange = useCallback(
    (selected: Option[]) => {
      setData(
        {
          blockchainType:
            selected[0].value === defaultBlockchainFilter
              ? []
              : [selected[0].value]
        },
        { updateQueryParams: true }
      );
    },
    [setData]
  );

  const selected = useMemo(() => {
    const filterValue = blockchainType[0];
    switch (filterValue) {
      case 'ethereum':
        return [blockchainOptions[1]];
      case 'polygon':
        return [blockchainOptions[2]];
      case 'base':
        return [blockchainOptions[3]];
    }
    return [blockchainOptions[0]];
  }, [blockchainType]);

  return (
    <Dropdown
      heading="Blockchain"
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
