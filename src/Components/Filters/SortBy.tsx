/* eslint-disable react-refresh/only-export-components */
import { useCallback, useMemo, useRef } from 'react';
import { useSearchInput } from '../../hooks/useSearchInput';
import { Dropdown, Option } from '../Dropdown';
import { FilterOption } from './FilterOption';
import { FilterPlaceholder } from './FilterPlaceholder';

export type SortOrderType = 'DESC' | 'ASC';

export const defaultSortOrder: SortOrderType = 'DESC';

type SortOption = {
  label: string;
  value: SortOrderType;
};

export const sortOptions: SortOption[] = [
  {
    label: 'Newest transfer first',
    value: 'DESC'
  },
  {
    label: 'Oldest transfer first',
    value: 'ASC'
  }
];

export function SortBy({
  disabled,
  disabledTooltipMessage
}: {
  disabled?: boolean;
  disabledTooltipMessage?: string;
}) {
  const [searchInputs, setData] = useSearchInput();

  const sortOrder = searchInputs.sortOrder as SortOrderType;

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
          sortOrder: selected?.[0]?.value || defaultSortOrder
        },
        { updateQueryParams: true }
      );
    },
    [setData]
  );

  const selected = useMemo(() => {
    return sortOrder === 'ASC' ? [sortOptions[1]] : [sortOptions[0]];
  }, [sortOrder]);

  return (
    <Dropdown
      heading="Sort by"
      disabled={isFilterDisabled}
      selected={selected}
      onChange={handleChange}
      options={sortOptions}
      renderPlaceholder={(selected, isOpen) => (
        <div
          className="relative"
          ref={buttonContainerRef}
          onMouseEnter={enableTooltipHover ? handleTooltipShow : undefined}
          onMouseLeave={enableTooltipHover ? handleTooltipHide : undefined}
          onMouseMove={enableTooltipHover ? handleTooltipMove : undefined}
        >
          <FilterPlaceholder
            icon="sort"
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
      footerComponent={
        <div className="text-text-secondary text-[10px] pt-1 pb-2 pl-[30px] pr-2">
          *NFTs & POAPs will get sorted separately
        </div>
      }
    />
  );
}
