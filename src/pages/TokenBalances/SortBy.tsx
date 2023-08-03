import { useCallback, useMemo } from 'react';
import { useSearchInput } from '../../hooks/useSearchInput';
import classNames from 'classnames';
import { Dropdown, Option } from '../../Components/Dropdown';
import { Icon } from '../../Components/Icon';

const options = [
  {
    label: 'Newest transfer first',
    value: 'ASC'
  },
  {
    label: 'Oldest transfer first',
    value: 'DESC'
  }
];
const buttonClass =
  'py-1.5 px-3 mr-3.5 rounded-full bg-glass-1 text-text-secondary border border-solid border-transparent text-xs hover:bg-glass-1-light';

export function SortBy() {
  const [{ sortOrder }, setData] = useSearchInput();

  const handleChange = useCallback(
    (selected: Option[]) => {
      setData(
        {
          sortOrder: selected?.[0]?.value || 'DESC'
        },
        { updateQueryParams: true }
      );
    },
    [setData]
  );

  const selected = useMemo(() => {
    return [sortOrder === 'ASC' ? options[0] : options[1]];
  }, [sortOrder]);

  return (
    <Dropdown
      selected={selected}
      onChange={handleChange}
      options={options}
      renderPlaceholder={selected => (
        <button
          className={classNames(
            buttonClass,
            'flex justify-center items-center !rounded-full'
          )}
        >
          <Icon name="sort" height={12} width={12} className="mr-1.5" />
          {selected.length === 0 || selected.length === 2
            ? 'All chains'
            : selected[0].label}
        </button>
      )}
      renderOption={({ option, isSelected, setSelected }) => {
        return (
          <label
            className="flex py-2 px-3 rounded-full hover:bg-glass mb-1 cursor-pointer text-left whitespace-nowrap"
            onClick={() => {
              setSelected([option]);
            }}
          >
            <Icon
              name="check-mark"
              width={8}
              height={8}
              className={classNames('mr-1', {
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
