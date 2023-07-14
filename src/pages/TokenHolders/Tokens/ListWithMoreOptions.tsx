import { useState, useMemo } from 'react';

const maxTokens = 7;
const minTokens = 1;

export function ListWithMoreOptions({
  list,
  onShowMore
}: {
  list: string[];
  onShowMore?: () => void;
}) {
  const [showMax, setShowMax] = useState(false);
  const items = useMemo(() => {
    if (!showMax) {
      return list?.slice(0, minTokens);
    }
    return list?.slice(0, maxTokens);
  }, [showMax, list]);

  return (
    <ul>
      {items.map((name, index) => (
        <li key={index} className="ellipsis mb-1">
          {name}
        </li>
      ))}
      {list.length === 0 && <li>--</li>}
      {list?.length > minTokens && (
        <>
          <li
            onClick={e => {
              e.stopPropagation();
              setShowMax(show => !show);
            }}
            className="text-text-button font-bold cursor-pointer"
          >
            see {showMax ? 'less' : 'more'}
          </li>
          {showMax && list.length > maxTokens && (
            <li
              onClick={e => {
                e.stopPropagation();
                if (showMax && list.length > maxTokens) {
                  onShowMore?.();
                  return;
                }
              }}
              className="text-text-button font-bold cursor-pointer"
            >
              see all
            </li>
          )}
        </>
      )}
    </ul>
  );
}
