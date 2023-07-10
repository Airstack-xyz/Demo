import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';
const tokenTypes = ['ERC721', 'ERC1155', 'POAP'];

export function Filters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const active = searchParams.get('tokenType') || '';

  return (
    <div>
      {tokenTypes.map(tokenType => {
        return (
          <button
            className={classNames(
              'py-1.5 px-3 mr-3.5 rounded-full glass-effect text-text-secondary border border-solid border-transparent text-xs',
              {
                '!border-stroke-color bg-secondary font-bold !text-text-primary':
                  active.toLowerCase() === tokenType.toLowerCase()
              }
            )}
            key={tokenType}
            onClick={() => {
              setSearchParams({ tokenType });
            }}
          >
            {tokenType}
          </button>
        );
      })}
    </div>
  );
}
