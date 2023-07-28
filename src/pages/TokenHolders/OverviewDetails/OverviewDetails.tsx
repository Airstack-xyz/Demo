import { useCallback, useEffect, useState } from 'react';
import { Icon } from '../../../Components/Icon';
import { OverviewDetailsTokens } from './Tokens/Tokens';
import { imageAndSubTextMap } from '../Overview/imageAndSubTextMap';
import { useSearchInput } from '../../../hooks/useSearchInput';
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

function Filters() {
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
        className="rounded-18 px-5 py-1 bg-glass border-solid-stroke"
        onClick={() => {
          setShow(prev => !prev);
        }}
      >
        Filters
      </button>
      {show && (
        <ul className="absolute top-full right-0 z-10 bg-glass p-3 rounded-18 border-solid-stroke">
          {options.map(({ label, value }) => {
            if (value === activeView) return null;

            return (
              <li key={value}>
                <label className="whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selected.includes(value)}
                    onChange={getFilterSetter(value)}
                    className="mr-1"
                  />
                  {label}
                </label>
              </li>
            );
          })}
          <li>
            <button
              onClick={() => {
                setFilters(
                  {
                    tokenFilters: selected
                  },
                  {
                    updateQueryParams: true
                  }
                );
              }}
            >
              Apply
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

export function OverviewDetails() {
  const [{ activeView, activeViewCount: count, activeViewToken }] =
    useSearchInput();
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Icon name="token-holders" height={20} width={20} />{' '}
          <span className="font-bold ml-1.5 text-sm">
            Token Holders of {activeViewToken}
          </span>
          <span className="mx-2.5">/</span>
          <span className="flex items-center">
            <Icon name="table-view" height={20} width={20} /> {count || ''}{' '}
            {imageAndSubTextMap[activeView as string]?.subText}
          </span>
        </div>
        <div className="w-auto">
          <Filters />
        </div>
      </div>
      <OverviewDetailsTokens />
    </div>
  );
}
