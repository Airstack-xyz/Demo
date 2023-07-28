import { useState, useEffect, useCallback } from 'react';
import { useSearchInput } from '../../../hooks/useSearchInput';
import { Icon } from '../../../Components/Icon';

type View = 'owners' | 'primaryEns' | 'ens' | 'lens' | 'farcaster' | 'xmtp';

const options: Array<{
  label: string;
  value: View;
}> = [
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
  const [selected, setSelected] = useState<string[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setSelected?.(filters);
  }, [filters]);

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

  return (
    <div className="relative">
      <button
        className="rounded-18 px-3 py-1.5 bg-glass border-solid-stroke flex-row-center"
        onClick={() => {
          setShow(prev => !prev);
        }}
      >
        <Icon name="filter" height={12} width={12} />{' '}
        <span className="ml-1.5 text-xs">Filters</span>
      </button>
      {show && (
        <ul className="absolute top-full right-0 z-10 bg-glass p-3 rounded-18 border-solid-stroke mt-1 text-xs [&>li]:mb-1.5 ">
          <li className="font-bold"> Token </li>
          {options.map(({ label, value }) => {
            if (value === activeView) return null;

            return (
              <li key={value} className="-mx-3">
                <label className="whitespace-nowrap flex flex-row items-end py-1.5 px-3 cursor-pointer hover:bg-glass">
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
          <li className="flex items-center mt-3 !mb-0">
            <button
              className="rounded-18 bg-button-primary px-3 py-1.5 mr-4"
              onClick={() => {
                setFilters(
                  {
                    tokenFilters: selected
                  },
                  {
                    updateQueryParams: true
                  }
                );
                setShow(false);
              }}
            >
              Apply
            </button>
            <button
              className="px-3 py-1.5"
              onClick={() => {
                setShow(false);
              }}
            >
              Close
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
