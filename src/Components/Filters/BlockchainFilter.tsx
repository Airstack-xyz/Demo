/* eslint-disable react-refresh/only-export-components */
import { useCallback, useMemo } from 'react';
import { useSearchInput } from '../../hooks/useSearchInput';
import { Dropdown, Option } from '../Dropdown';
import { FilterOption } from './FilterOption';
import { FilterPlaceholder } from './FilterPlaceholder';
import { DisabledTooltip, useDisabledTooltip } from './DisabledTooltip';
import { tokenBlockchains } from '../../constants';
import { capitalizeFirstLetter } from '../../utils';

export type BlockchainFilterType = 'all' | (typeof tokenBlockchains)[number];

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
  ...tokenBlockchains.map(item => ({
    label: capitalizeFirstLetter(item),
    value: item
  }))
];

export function BlockchainFilter({
  disabled,
  disabledTooltipText
}: {
  disabled?: boolean;
  disabledTooltipText?: string;
}) {
  const [searchInputs, setData] = useSearchInput();
  const {
    tooltipRef,
    containerRef,
    handleTooltipShow,
    handleTooltipHide,
    handleTooltipMove
  } = useDisabledTooltip();

  const blockchainType = searchInputs.blockchainType as BlockchainFilterType[];

  const enableTooltipHover = disabled && Boolean(disabledTooltipText);

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
        <div
          className="relative"
          ref={containerRef}
          onMouseEnter={enableTooltipHover ? handleTooltipShow : undefined}
          onMouseLeave={enableTooltipHover ? handleTooltipHide : undefined}
          onMouseMove={enableTooltipHover ? handleTooltipMove : undefined}
        >
          <FilterPlaceholder
            icon="blockchain-filter"
            isOpen={isOpen}
            isDisabled={isFilterDisabled}
            label={selected[0].label}
          />
          <DisabledTooltip
            isEnabled={enableTooltipHover}
            tooltipRef={tooltipRef}
            tooltipText={disabledTooltipText}
          />
        </div>
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
