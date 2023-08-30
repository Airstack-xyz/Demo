import { useCallback, useEffect, useMemo } from 'react';
import { useSearchInput } from '../../hooks/useSearchInput';
import { Dropdown, Option } from '../Dropdown';
import { FilterOption } from './FilterOption';
import { FilterPlaceholder } from './FilterPlaceholder';

const blockchainOptions = [
  {
    label: 'All chains',
    value: '*'
  },
  {
    label: 'Ethereum',
    value: 'ethereum'
  },
  {
    label: 'Polygon',
    value: 'polygon'
  }
];

export function BlockchainFilter() {
  const [{ blockchainType, tokenType }, setData] = useSearchInput();
  const isPoapFilterApplied = tokenType === 'POAP';

  useEffect(() => {
    // If POAP filter is applied, reset blockchain filter
    if (isPoapFilterApplied && blockchainType.length > 0) {
      setData(
        {
          blockchainType: []
        },
        { updateQueryParams: true }
      );
    }
  }, [blockchainType, isPoapFilterApplied, setData]);

  const handleChange = useCallback(
    (selected: Option[]) => {
      setData(
        {
          blockchainType: selected[0].value === '*' ? [] : [selected[0].value]
        },
        { updateQueryParams: true }
      );
    },
    [setData]
  );

  const selected = useMemo(() => {
    const options = [];
    const value = blockchainType[0];
    switch (value) {
      case 'ethereum':
        options.push(blockchainOptions[1]);
        break;
      case 'polygon':
        options.push(blockchainOptions[2]);
        break;
      default:
        options.push(blockchainOptions[0]);
        break;
    }
    return options;
  }, [blockchainType]);

  return (
    <Dropdown
      heading="Blockchain"
      selected={selected}
      onChange={handleChange}
      options={blockchainOptions}
      disabled={isPoapFilterApplied}
      renderPlaceholder={(selected, isOpen) => (
        <FilterPlaceholder
          isOpen={isOpen}
          disabled={isPoapFilterApplied}
          icon="blockchain-filter"
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
