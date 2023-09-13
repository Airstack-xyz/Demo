import classNames from 'classnames';
import { useSearchInput } from '../../hooks/useSearchInput';
import { tokenTypes } from './constants';
import { memo, useCallback, useMemo } from 'react';
import { getActiveSnapshotInfo } from '../../utils/activeSnapshotInfoString';

const buttonClass =
  'py-1.5 px-3 mr-3.5 rounded-full bg-glass-1 text-text-secondary border border-solid border-transparent text-xs hover:bg-glass-1-light';

export const Filters = memo(function Filters() {
  const [{ tokenType: existingTokenType = '', activeSnapshotInfo }, setData] =
    useSearchInput();

  const snapshot = useMemo(
    () => getActiveSnapshotInfo(activeSnapshotInfo),
    [activeSnapshotInfo]
  );

  const getFilterHandler = useCallback(
    (tokenType: string) => () => {
      const input = {
        tokenType:
          existingTokenType.toLowerCase() === tokenType.toLowerCase()
            ? ''
            : tokenType
      };
      if (input.tokenType === 'All') {
        input.tokenType = '';
      }
      setData(input, { updateQueryParams: true });
    },
    [existingTokenType, setData]
  );

  const filters = useMemo(() => {
    let _filters = null;
    if (snapshot.isApplicable) {
      _filters = tokenTypes.filter(type => type !== 'ERC20' && type !== 'POAP');
    } else {
      _filters = tokenTypes.filter(type => type !== 'ERC20');
    }
    return ['All', ..._filters];
  }, [snapshot.isApplicable]);

  return (
    <div className="flex justify-between items-center">
      <div>
        {filters.map(tokenType => {
          return (
            <button
              className={classNames(buttonClass, {
                '!border-white bg-secondary font-bold !text-text-primary':
                  tokenType === 'All'
                    ? !existingTokenType
                    : existingTokenType.toLowerCase() ===
                      tokenType.toLowerCase()
              })}
              key={tokenType}
              onClick={getFilterHandler(tokenType)}
            >
              {tokenType}
            </button>
          );
        })}
      </div>
    </div>
  );
});
