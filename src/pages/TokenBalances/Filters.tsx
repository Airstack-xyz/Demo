import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';
import {
  TokenBalanceQueryParams,
  useSearchInput
} from '../../hooks/useSearchInput';
import { tokenTypes } from './constants';
import { memo, useCallback } from 'react';

export const Filters = memo(function Filters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const active = searchParams.get('filterBy') || '';
  const {
    filterBy: existingTokenType = '',
    setData,
    ...rest
  } = useSearchInput();

  const getFilterHandler = useCallback(
    (tokenType: string) => () => {
      const input = {
        ...rest,
        filterBy:
          existingTokenType.toLowerCase() === tokenType.toLowerCase()
            ? ''
            : tokenType
      };

      if (input.filterBy === 'All') {
        input.filterBy = '';
      }

      setData(input);
      setSearchParams(input as TokenBalanceQueryParams);
    },
    [existingTokenType, rest, setData, setSearchParams]
  );

  const filters = ['All', ...tokenTypes];

  return (
    <div>
      {filters.map(tokenType => {
        return (
          <button
            className={classNames(
              'py-1.5 px-3 mr-3.5 rounded-full glass-effect-button text-text-secondary border border-solid border-transparent text-xs',
              {
                '!border-stroke-color bg-secondary font-bold !text-text-primary':
                  tokenType === 'All'
                    ? !active
                    : active.toLowerCase() === tokenType.toLowerCase()
              }
            )}
            key={tokenType}
            onClick={getFilterHandler(tokenType)}
          >
            {tokenType}
          </button>
        );
      })}
    </div>
  );
});
