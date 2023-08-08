import { useCallback, useEffect, useMemo } from 'react';
import { useSearchInput } from '../../hooks/useSearchInput';
import classNames from 'classnames';
import { Dropdown, Option } from '../../Components/Dropdown';
import { Icon } from '../../Components/Icon';
const blockchainOptions = [
  {
    label: 'Blockchain',
    value: ''
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
const buttonClass =
  'py-1.5 px-3 mr-3.5 rounded-full bg-glass-1 text-text-secondary border border-solid border-transparent text-xs hover:bg-glass-1-light disabled:hover:bg-glass-1 disabled:hover:cursor-not-allowed disabled:opacity-80';

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
          blockchainType: selected.map(item => item.value)
        },
        { updateQueryParams: true }
      );
    },
    [setData]
  );

  const selected = useMemo(() => {
    return blockchainType.map(type => ({
      label: type === 'ethereum' ? 'Ethereum' : 'Polygon',
      value: type
    }));
  }, [blockchainType]);

  return (
    <Dropdown
      selected={selected}
      onChange={handleChange}
      options={blockchainOptions}
      disabled={isPoapFilterApplied}
      renderPlaceholder={(selected, isOpen) => (
        <button
          disabled={isPoapFilterApplied}
          className={classNames(
            buttonClass,
            'flex justify-center items-center !rounded-full',
            { 'border-white': isOpen }
          )}
        >
          <Icon
            name="blockchain-filter"
            height={12}
            width={12}
            className="mr-1.5"
          />
          {selected.length === 0 || selected.length === 2
            ? 'All chains'
            : selected[0].label}
        </button>
      )}
      renderOption={({ option, isSelected, selected, setSelected }) => {
        if (!option.value) {
          return (
            <div className="font-bold py-2 px-5 rounded-full mb-1 text-left whitespace-nowrap">
              Blockchain
            </div>
          );
        }
        return (
          <label
            className={classNames(
              'flex py-2 px-5 rounded-full hover:bg-glass mb-1 cursor-pointer text-left whitespace-nowrap',
              {
                'font-bold': isSelected
              }
            )}
            onClick={() => {
              const newSelected = isSelected
                ? selected.filter(item => item.value !== option.value)
                : [...selected, option];
              setSelected(newSelected);
            }}
          >
            <input
              type="checkbox"
              className="mr-1.5"
              defaultChecked={isSelected}
            />
            {option.label}
          </label>
        );
      }}
    />
  );
}
