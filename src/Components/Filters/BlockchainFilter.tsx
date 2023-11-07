/* eslint-disable react-refresh/only-export-components */
import { useCallback, useEffect, useMemo } from 'react';
import { useSearchInput } from '../../hooks/useSearchInput';
import { Dropdown, Option } from '../Dropdown';
import { FilterOption } from './FilterOption';
import { FilterPlaceholder } from './FilterPlaceholder';
import { getActiveSnapshotInfo } from '../../utils/activeSnapshotInfoString';

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

  const activeSnapshotInfo = searchInputs.activeSnapshotInfo;
  const tokenType = searchInputs.tokenType;
  const blockchainType = searchInputs.blockchainType as BlockchainFilterType[];

  const snapshotInfo = useMemo(
    () => getActiveSnapshotInfo(activeSnapshotInfo),
    [activeSnapshotInfo]
  );

  const isPoap = tokenType === 'POAP';

  const isFilterDisabled = disabled || isPoap || snapshotInfo.isApplicable;
  const hasBlockchainFilterApplied = blockchainType.length > 0;

  // Reset blockchain filter if POAP filter is applied
  useEffect(() => {
    // TODO: Remove below base restriction when snapshots is released for other blockchains
    if (snapshotInfo.isApplicable) {
      setData(
        {
          blockchainType: ['base']
        },
        { updateQueryParams: true }
      );
      return;
    }
    // ====================================================================================
    if (isFilterDisabled && hasBlockchainFilterApplied) {
      setData(
        {
          blockchainType: []
        },
        { updateQueryParams: true }
      );
    }
  }, [
    hasBlockchainFilterApplied,
    isFilterDisabled,
    setData,
    snapshotInfo.isApplicable
  ]);

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
