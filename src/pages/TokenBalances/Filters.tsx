import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';
import { useSearchInput } from '../../hooks/useSearchInput';
import { tokenTypes } from './constants';

export function Filters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const active = searchParams.get('filterBy') || '';
  const {
    filterBy: existingTokenType = '',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setData,
    ...rest
  } = useSearchInput();

  return (
    <div>
      {tokenTypes.map(tokenType => {
        return (
          <button
            className={classNames(
              'py-1.5 px-3 mr-3.5 rounded-full bg-glass-button text-text-secondary border border-solid border-transparent text-xs',
              {
                '!border-stroke-color bg-secondary font-bold !text-text-primary':
                  active.toLowerCase() === tokenType.toLowerCase()
              }
            )}
            key={tokenType}
            onClick={() => {
              setSearchParams({
                ...rest,
                filterBy:
                  existingTokenType.toLowerCase() === tokenType.toLowerCase()
                    ? ''
                    : tokenType
              });
            }}
          >
            {tokenType}
          </button>
        );
      })}
    </div>
  );
}
