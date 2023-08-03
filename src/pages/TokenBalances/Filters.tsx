import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';
import { useSearchInput } from '../../hooks/useSearchInput';
import { tokenTypes } from './constants';
import { memo, useCallback } from 'react';
import { BlockchainFilter } from './BlockchainFilter';
import { SortBy } from './SortBy';
import { isMobileDevice } from '../../utils/isMobileDevice';

export const Filters = memo(function Filters() {
  const setSearchParams = useSearchParams()[1];
  const [{ tokenType: existingTokenType = '', ...rest }, setData] =
    useSearchInput();

  const getFilterHandler = useCallback(
    (tokenType: string) => () => {
      const input = {
        ...rest,
        tokenType:
          existingTokenType.toLowerCase() === tokenType.toLowerCase()
            ? ''
            : tokenType
      };

      if (input.tokenType === 'All') {
        input.tokenType = '';
      }

      setData(input);
      // eslint-disable-next-line
      setSearchParams(input as any);
    },
    [existingTokenType, rest, setData, setSearchParams]
  );

  const filters = ['All', ...tokenTypes];

  const buttonClass =
    'py-1.5 px-3 mr-3.5 rounded-full bg-glass-1 text-text-secondary border border-solid border-transparent text-xs hover:bg-glass-1-light';

  const isMobile = isMobileDevice();

  return (
    <div className="flex justify-between items-center">
      <div>
        {filters.map(tokenType => {
          return (
            <button
              className={classNames(buttonClass, {
                '!border-stroke-color bg-secondary font-bold !text-text-primary':
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
      {!isMobile && (
        <div>
          <BlockchainFilter />
          <SortBy />
        </div>
      )}
    </div>
  );
});
