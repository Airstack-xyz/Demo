/* eslint-disable react-refresh/only-export-components */
import classNames from 'classnames';

export const tokenOptions: TokenSelectOption[] = [
  {
    label: 'All',
    value: null
  },
  {
    label: 'ERC721',
    value: 'ERC721'
  },
  {
    label: 'ERC1155',
    value: 'ERC1155'
  },
  {
    label: 'POAP',
    value: 'POAP'
  },
  {
    label: 'ERC20',
    value: 'ERC20'
  }
];

export const defaultTokenOption = tokenOptions[0];

export type TokenSelectOption = {
  label: string;
  value: string | null;
};

type FiltersProps = {
  selectedOption: TokenSelectOption;
  onSelect: (option: TokenSelectOption) => void;
};

export default function Filters({ selectedOption, onSelect }: FiltersProps) {
  return (
    <div className="flex gap-3">
      {tokenOptions.map(option => {
        const isSelected = selectedOption.value === option.value;
        const onClick = isSelected ? undefined : () => onSelect(option);
        return (
          <button
            tabIndex={-1}
            key={option.value}
            type="button"
            className={classNames(
              'py-1.5 px-3 rounded-full bg-glass-1 text-text-secondary border border-solid border-transparent text-xs hover:bg-glass-1-light',
              isSelected &&
                '!border-white bg-secondary font-bold !text-text-primary'
            )}
            onClick={onClick}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
