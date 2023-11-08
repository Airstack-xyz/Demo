/* eslint-disable react-refresh/only-export-components */
import { useCallback, useMemo, useRef } from 'react';
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

export function BlockchainFilter({
  disabled,
  disabledTooltipMessage
}: {
  disabled?: boolean;
  disabledTooltipMessage?: string;
}) {
  const [searchInputs, setData] = useSearchInput();

  const blockchainType = searchInputs.blockchainType as BlockchainFilterType[];

  const tooltipContainerRef = useRef<HTMLDivElement>(null);
  const buttonContainerRef = useRef<HTMLDivElement>(null);

  const enableTooltipHover = disabled && Boolean(disabledTooltipMessage);

  const isFilterDisabled = disabled;

  const handleTooltipShow = useCallback(() => {
    if (tooltipContainerRef.current) {
      tooltipContainerRef.current.style.display = 'block';
    }
  }, []);

  const handleTooltipHide = useCallback(() => {
    if (tooltipContainerRef.current) {
      tooltipContainerRef.current.style.display = 'none';
    }
  }, []);

  const handleTooltipMove = useCallback((event: React.MouseEvent) => {
    if (tooltipContainerRef.current && buttonContainerRef.current) {
      const rect = buttonContainerRef.current.getBoundingClientRect();
      const left = event.clientX - rect.left + 20;
      const top = event.clientY - rect.top - 3;
      tooltipContainerRef.current.style.left = `${left}px`;
      tooltipContainerRef.current.style.top = `${top}px`;
    }
  }, []);

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
          ref={buttonContainerRef}
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
          <div
            ref={tooltipContainerRef}
            className="absolute hidden before-bg-glass-1 before:rounded-[16px] before:-z-10 rounded-[16px] py-1.5 px-3 w-max text-text-secondary z-[50]"
          >
            {disabledTooltipMessage}
          </div>
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
