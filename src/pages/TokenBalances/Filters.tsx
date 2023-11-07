import classNames from 'classnames';
import { memo, useCallback, useMemo } from 'react';
import { CachedQuery, useSearchInput } from '../../hooks/useSearchInput';
import { getActiveSnapshotInfo } from '../../utils/activeSnapshotInfoString';
import { tokenTypes, tokenTypesForFilter } from './constants';

const buttonClass =
  'py-1.5 px-3 mr-3.5 rounded-full bg-glass-1 text-text-secondary border border-solid border-transparent text-xs hover:bg-glass-1-light';

function FiltersComponent() {
  const [{ tokenType, activeSnapshotInfo }, setData] = useSearchInput();

  const snapshotInfo = useMemo(
    () => getActiveSnapshotInfo(activeSnapshotInfo),
    [activeSnapshotInfo]
  );

  const getFilterHandler = useCallback(
    (filter: string) => () => {
      const filterValues: Partial<CachedQuery> = {
        tokenType: tokenType === filter ? '' : filter
      };
      if (filter === 'All') {
        filterValues.tokenType = '';
      }
      // Reset blockchain filter if POAP filter is applied
      if (filter === 'POAP') {
        filterValues.blockchainType = [];
      }
      // Reset snapshot filter if POAP filter is applied
      if (snapshotInfo.isApplicable) {
        filterValues.activeSnapshotInfo = undefined;
      }
      setData(filterValues, { updateQueryParams: true });
    },
    [tokenType, snapshotInfo.isApplicable, setData]
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
        {filters.map(filter => {
          return (
            <button
              className={classNames(buttonClass, {
                '!border-white bg-secondary font-bold !text-text-primary':
                  filter === 'All' ? !tokenType : tokenType === filter
              })}
              key={filter}
              onClick={getFilterHandler(filter)}
            >
              {filter}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const Filters = memo(FiltersComponent);
