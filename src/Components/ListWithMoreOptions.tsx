import classNames from 'classnames';
import { useState, useMemo, useCallback } from 'react';

const maxCount = 7;
const minCount = 1;

export function ListWithMoreOptions({
  list,
  listFor,
  onShowMore,
  onItemClick
}: {
  list: string[];
  listFor: string;
  onShowMore?: () => void;
  onItemClick: (address: string, type: string) => void;
}) {
  const [showMax, setShowMax] = useState(false);
  const items = useMemo(() => {
    if (!showMax) {
      return list?.slice(0, minCount);
    }
    return list?.slice(0, maxCount);
  }, [showMax, list]);

  const getItemClickHandler = useCallback(
    (value: string) => () => {
      onItemClick(value, listFor);
    },
    [listFor, onItemClick]
  );

  return (
    <ul>
      {items.map((name, index) => (
        <li key={index} className="ellipsis mb-1">
          <div
            className={classNames(
              'px-1 py-1 rounded-18 ellipsis max-w-[200px] sm:max-w-none',
              {
                'hover:bg-glass-1 cursor-pointer': name
              }
            )}
            onClick={getItemClickHandler(name)}
          >
            {name || '--'}
          </div>
        </li>
      ))}
      {list.length === 0 && <li>--</li>}
      {!showMax && list?.length > minCount && (
        <li
          onClick={e => {
            e.stopPropagation();
            setShowMax(show => !show);
          }}
          className="text-text-button font-bold cursor-pointer px-1 py-1"
        >
          see more
        </li>
      )}
      {showMax && list.length > maxCount && (
        <li
          onClick={e => {
            e.stopPropagation();
            if (showMax && list.length > maxCount) {
              onShowMore?.();
              return;
            }
          }}
          className="text-text-button font-bold cursor-pointer px-1 py-1"
        >
          see all
        </li>
      )}
    </ul>
  );
}
