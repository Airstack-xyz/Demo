import { useCallback, useEffect, useMemo } from 'react';
import { useSearchInput } from '../../hooks/useSearchInput';
import classNames from 'classnames';
import { Dropdown, Option } from '../Dropdown';
import { Icon } from '../Icon';

const blockchainOptions = [
  {
    label: 'All chains',
    value: '*'
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
  'py-1.5 px-3 mr-3.5 rounded-full bg-glass-1 text-text-secondary border border-solid border-transparent text-xs hover:bg-glass-1-light disabled:hover:bg-glass-1 disabled:hover:cursor-not-allowed disabled:opacity-80 flex justify-center items-center';

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
          blockchainType: selected[0].value === '*' ? [] : [selected[0].value]
        },
        { updateQueryParams: true }
      );
    },
    [setData]
  );

  const selected = useMemo(() => {
    const options = [];
    const value = blockchainType[0];
    switch (value) {
      case 'ethereum':
        options.push(blockchainOptions[1]);
        break;
      case 'polygon':
        options.push(blockchainOptions[2]);
        break;
      default:
        options.push(blockchainOptions[0]);
        break;
    }
    return options;
  }, [blockchainType]);

  return (
    <Dropdown
      heading="Blockchain"
      selected={selected}
      onChange={handleChange}
      options={blockchainOptions}
      disabled={isPoapFilterApplied}
      renderPlaceholder={(selected, isOpen) => (
        <button
          disabled={isPoapFilterApplied}
          className={classNames(buttonClass, { 'border-white': isOpen })}
        >
          <Icon
            name="blockchain-filter"
            height={12}
            width={12}
            className="mr-1.5"
          />
          {selected[0].label}
        </button>
      )}
      renderOption={({ option, isSelected, setSelected }) => {
        return (
          <label
            className={classNames(
              'flex py-1 px-2 rounded-full hover:bg-glass mb-1 cursor-pointer text-left whitespace-nowrap',
              {
                'font-bold': isSelected
              }
            )}
            onClick={() => {
              setSelected([option]);
            }}
          >
            <Icon
              name="check-mark"
              width={8}
              height={8}
              className={classNames('mx-2', {
                invisible: !isSelected
              })}
            />
            {option.label}
          </label>
        );
      }}
    />
  );
}
