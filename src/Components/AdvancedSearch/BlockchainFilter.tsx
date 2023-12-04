/* eslint-disable react-refresh/only-export-components */
import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { Icon } from '../Icon';
import { FilterPlaceholder } from '../Filters/FilterPlaceholder';

export const chainOptions = [
  {
    label: 'All chains',
    value: null
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
    label: 'Gnosis',
    value: 'gnosis'
  }
];

export const defaultChainOption = chainOptions[0];

export type BlockchainSelectOption = {
  label: string;
  value: string | null;
};

type BlockchainFilterProps = {
  isDisabled?: boolean;
  selectedOption: BlockchainSelectOption;
  onSelect: (option: BlockchainSelectOption) => void;
};

export default function BlockchainFilter({
  isDisabled,
  selectedOption,
  onSelect
}: BlockchainFilterProps) {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const containerRef = useOutsideClick<HTMLDivElement>(() =>
    setDropdownVisible(false)
  );

  const showDropdown = useCallback(() => {
    setDropdownVisible(true);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <FilterPlaceholder
        tabIndex={-1}
        icon="blockchain-filter"
        className="text-white disabled:cursor-not-allowed"
        isOpen={isDropdownVisible}
        isDisabled={isDisabled}
        label={selectedOption.label}
        onClick={showDropdown}
      />
      {isDropdownVisible && (
        <div className="py-2 pl-3 pr-5 mt-1 flex flex-col gap-y-1 rounded-md shadow bg-glass absolute top-full z-10 min-w-[108px]">
          {chainOptions.map(option => {
            const isSelected = selectedOption.value === option.value;
            const onClick = isSelected
              ? undefined
              : () => {
                  onSelect(option);
                  setDropdownVisible(false);
                };
            return (
              <button
                tabIndex={-1}
                key={option.value}
                type="button"
                className={classNames(
                  'py-1 flex items-center rounded-lg text-xs',
                  isSelected ? 'font-bold' : 'hover:text-white/50'
                )}
                onClick={onClick}
              >
                <Icon
                  name="check-mark"
                  className={classNames('mr-1.5', !isSelected && 'invisible')}
                  height={10}
                  width={10}
                />
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
