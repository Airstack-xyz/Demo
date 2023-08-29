/* eslint-disable react-refresh/only-export-components */
import { useCallback, useMemo } from 'react';
import { useSearchInput } from '../../hooks/useSearchInput';
import classNames from 'classnames';
import { Dropdown, Option } from '../Dropdown';
import { Icon } from '../Icon';

const sortOptions = [
  {
    label: 'Newest transfer first',
    value: 'DESC'
  },
  {
    label: 'Oldest transfer first',
    value: 'ASC'
  }
];

export const defaultSortOrder = sortOptions[0].value;

const buttonClass =
  'py-1.5 px-3 mr-3.5 rounded-full bg-glass-1 text-text-secondary border border-solid border-transparent text-xs hover:bg-glass-1-light';

export function SortBy() {
  const [{ sortOrder }, setData] = useSearchInput();

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
    const options = [];
    if (!sortOrder || sortOrder === defaultSortOrder) {
      options.push(sortOptions[0]);
    } else {
      options.push(sortOptions[1]);
    }
    return options;
  }, [sortOrder]);

  return (
    <Dropdown
      heading="Sort by"
      selected={selected}
      onChange={handleChange}
      options={sortOptions}
      renderPlaceholder={(selected, isOpen) => (
        <button
          className={classNames(
            buttonClass,
            'flex justify-center items-center !rounded-full',
            { 'border-white': isOpen }
          )}
        >
          <Icon name="sort" height={12} width={12} className="mr-1.5" />
          {selected[0].label}
        </button>
      )}
      renderOption={({ option, isSelected, setSelected }) => {
        return (
          <label
            className={classNames(
              'flex py-1 px-3 rounded-full hover:bg-glass mb-1 cursor-pointer text-left whitespace-nowrap',
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
