/* eslint-disable react-refresh/only-export-components */
import { useCallback, useMemo } from 'react';
import { tokenBlockchains } from '../../constants';
import { useSearchInput } from '../../hooks/useSearchInput';
import { TokenBlockchain } from '../../types';
import { capitalizeFirstLetter } from '../../utils';
import { Dropdown, Option } from '../Dropdown';
import { DisabledTooltip, useDisabledTooltip } from './DisabledTooltip';
import { FilterOption } from './FilterOption';
import { FilterPlaceholder } from './FilterPlaceholder';

export type BlockchainFilterType = 'all' | TokenBlockchain;

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
    const option = blockchainOptions.find(item => item.value === filterValue);
    if (option) {
      return [option];
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
