import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchInput } from '../../../hooks/useSearchInput';
import { Icon } from '../../../Components/Icon';
import classNames from 'classnames';
import { useLoaderContext } from '../../../hooks/useLoader';

type FilterType =
  | 'owners'
  | 'primaryEns'
  | 'ens'
  | 'lens'
  | 'farcaster'
  | 'xmtp';

type FilterOption = {
  label: string;
  value: FilterType;
};

const options: FilterOption[] = [
  {
    label: 'has primary ENS',
    value: 'primaryEns'
  },
  {
    label: 'has ENS',
    value: 'ens'
  },
  {
    label: 'has Lens',
    value: 'lens'
  },
  {
    label: 'has Farcaster',
    value: 'farcaster'
  },
  {
    label: 'has XMTP',
    value: 'xmtp'
  }
];

export function Filters() {
  const [{ tokenFilters: filters, activeView }, setFilters] = useSearchInput();
  const { isLoading } = useLoaderContext();
  const [selected, setSelected] = useState<string[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setSelected(filters);
  }, [filters, show]);

  const handleClose = useCallback(() => {
    setShow(false);
    setSelected([]);
  }, []);

  const handleApply = useCallback(() => {
    setFilters(
      {
        tokenFilters: selected
      },
      {
        updateQueryParams: true
      }
    );
    setShow(false);
    setSelected([]);
  }, [selected, setFilters]);

  const getFilterSetter = useCallback(
    (filter: string) => () => {
      setSelected(prev => {
        if (prev.includes(filter)) {
          return prev.filter(item => item !== filter);
        }
        return [...prev, filter];
      });
    },
    []
  );

  const newFiltersApplied = useMemo(() => {
    return (
      Boolean(selected.find(filter => !filters.includes(filter))) ||
      selected.length !== filters.length
    );
  }, [filters, selected]);

  const appliedFiltersCount = useMemo(() => {
    return filters.length > 1 ? filters.length - 1 : 0;
  }, [filters]);

  return (
    <div className="relative">
      <button
        className={classNames(
          'rounded-18 px-3 py-1.5 bg-glass-1 hover:bg-glass-1-light border-solid-stroke flex-row-center disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:bg-glass-1',
          {
            '!border-white': show
          }
        )}
        disabled={isLoading}
        onClick={() => {
          setShow(prev => !prev);
        }}
      >
        <Icon name="filter" height={12} width={12} />{' '}
        <span className="ml-1.5 text-[13px]">
          Filters {appliedFiltersCount ? `(${appliedFiltersCount})` : ''}
        </span>
      </button>
      {show && (
        <ul className="absolute top-full right-0 z-10 bg-glass p-3 rounded-18 border-solid-stroke mt-1 text-xs [&>li]:mb-1.5 ">
          {options.map(({ label, value }) => {
            if (value === activeView) {
              return null;
            }
            return (
              <li key={value} className="-mx-3">
                <label className="whitespace-nowrap flex items-center py-1.5 px-3 cursor-pointer hover:bg-glass">
                  <input
                    type="checkbox"
                    checked={selected.includes(value)}
                    onChange={getFilterSetter(value)}
                    className="mr-1.5 bg-transparent"
                  />
                  {label}
                </label>
              </li>
            );
          })}
          <li className="flex items-center justify-center gap-5 mt-3 !mb-0">
            <button
              className="rounded-18 button-primary px-3 py-1.5 enabled:hover:opacity-60 disabled:opacity-75 disabled:cursor-not-allowed"
              onClick={handleApply}
              disabled={!newFiltersApplied}
            >
              Apply
            </button>
            <button
              className="px-3 py-1.5 enabled:hover:opacity-60"
              onClick={handleClose}
            >
              Close
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
