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

export function BlockchainFilter({ disabled }: { disabled?: boolean }) {
  const [{ blockchainType, tokenType }, setData] = useSearchInput();

  const isPoap = tokenType === 'POAP';

  const isFilterDisabled = disabled || isPoap;

  // Reset blockchain filter if POAP filter is applied
  useEffect(() => {
    if (isFilterDisabled) {
      setData(
        {
          blockchainType: []
        },
        { updateQueryParams: true }
      );
    }
  }, [isFilterDisabled, setData]);

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
      disabled={isFilterDisabled}
      renderPlaceholder={(selected, isOpen, isDisabled) => (
        <FilterPlaceholder
          icon="blockchain-filter"
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
