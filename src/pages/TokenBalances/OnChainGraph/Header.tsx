import classNames from 'classnames';
import { Icon } from '../../../Components/Icon';
import { useSearchInput } from '../../../hooks/useSearchInput';

export function Header({
  showGridView,
  setShowGridView,
  identities
}: {
  showGridView: boolean;
  setShowGridView: (show: boolean) => void;
  identities: string[];
}) {
  const setSearchInputData = useSearchInput()[1];
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="flex items-center max-w-[60%] sm:w-auto overflow-hidden mr-2">
          <div
            className="flex items-center cursor-pointer hover:bg-glass-1 px-2 py-1 rounded-full overflow-hidden"
            onClick={() => {
              setSearchInputData(
                {
                  activeSocialInfo: ''
                },
                {
                  updateQueryParams: true
                }
              );
            }}
          >
            <Icon
              name="token-holders"
              height={20}
              width={20}
              className="mr-2"
            />
            <span className="text-text-secondary break-all cursor-pointer ellipsis">
              Token balances of {identities.join(', ')}
            </span>
          </div>
          <span className="text-text-secondary">/</span>
        </div>
        <div className="flex items-center ellipsis">
          <Icon name="table-view" height={20} width={20} className="mr-2" />
          <span className="text-text-primary">OnChain Graph</span>
        </div>
      </div>
      <div className="flex items-center">
        <span className="inline-flex items-center bg-glass-1 rounded-full">
          <button
            onClick={() => setShowGridView(true)}
            className={classNames('py-1 px-2.5', {
              'bg-glass border-solid-stroke rounded-full': showGridView
            })}
          >
            <Icon name="grid-view" />
          </button>
          <button
            onClick={() => setShowGridView(false)}
            className={classNames('py-1 px-2.5', {
              'bg-glass border-solid-stroke rounded-full': !showGridView
            })}
          >
            <Icon name="list-view" />
          </button>
        </span>
        <button className="bg-glass-1 border-solid-stroke rounded-full flex items-center py-1 px-2.5 ml-3">
          <Icon name="bullseye" width={12} height={12} className="mr-1" />
          Scoring
        </button>
      </div>
    </div>
  );
}
