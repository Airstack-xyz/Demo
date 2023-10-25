import classNames from 'classnames';
import { memo, useCallback, useMemo } from 'react';
import { useSearchInput } from '../../hooks/useSearchInput';
import { getActiveSnapshotInfo } from '../../utils/activeSnapshotInfoString';
import { tokenTypes, tokenTypesForFilter } from './constants';

const buttonClass =
  'py-1.5 px-3 mr-3.5 rounded-full bg-glass-1 text-text-secondary border border-solid border-transparent text-xs hover:bg-glass-1-light';

export const Filters = memo(function Filters() {
  const [{ tokenType: existingTokenType = '', activeSnapshotInfo }, setData] =
    useSearchInput();

  const snapshotInfo = useMemo(
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
    if (snapshotInfo.isApplicable) {
      return ['All', ...tokenTypes];
    }
    return ['All', ...tokenTypesForFilter];
  }, [snapshotInfo.isApplicable]);

  return (
    <div className="flex items-center scroll-shadow-r">
      <div className="flex overflow-auto pr-[50px] no-scrollbar">
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
