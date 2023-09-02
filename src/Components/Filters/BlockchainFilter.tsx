/* eslint-disable react-refresh/only-export-components */
import { useCallback, useEffect, useMemo } from 'react';
import { useSearchInput } from '../../hooks/useSearchInput';
import { Dropdown, Option } from '../Dropdown';
import { FilterOption } from './FilterOption';
import { FilterPlaceholder } from './FilterPlaceholder';

export const enum BlockchainFilterType {
  ALL = '*',
  ETHEREUM = 'ethereum',
  POLYGON = 'polygon'
}

export const defaultBlockchainFilter = BlockchainFilterType.ALL;

export const blockchainOptions = [
  {
    label: 'All chains',
    value: BlockchainFilterType.ALL
  },
  {
    label: 'Ethereum',
    value: BlockchainFilterType.ETHEREUM
  },
  {
    label: 'Polygon',
    value: BlockchainFilterType.POLYGON
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
    if (filterValue === BlockchainFilterType.ETHEREUM) {
      return [blockchainOptions[1]];
    }
    if (filterValue === BlockchainFilterType.POLYGON) {
      return [blockchainOptions[2]];
    }
    return [blockchainOptions[0]];
  }, [blockchainType]);

  return (
    <Dropdown
      heading="Blockchain"
      selected={selected}
      onChange={handleChange}
      options={blockchainOptions}
      disabled={isPoapFilterApplied}
      renderPlaceholder={(selected, isOpen, isDisabled) => (
        <FilterPlaceholder
          isOpen={isOpen}
          disabled={isPoapFilterApplied || isDisabled}
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
