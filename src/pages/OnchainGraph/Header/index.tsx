import { memo } from 'react';
import classNames from 'classnames';
import { Icon } from '../../../Components/Icon';
import { ScoreMap } from '../constants';
import { Tooltip } from '../../../Components/Tooltip';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { useIdentity } from '../hooks/useIdentity';
import { createFormattedRawInput } from '../../../utils/createQueryParamsWithMention';
import { ScoreOptions } from './ScoreOptions';

function Header({
  showGridView,
  setShowGridView,
  identities,
  onApplyScore,
  loading
}: {
  showGridView: boolean;
  setShowGridView: (show: boolean) => void;
  identities: string[];
  onApplyScore: (score: ScoreMap) => Promise<void>;
  loading?: boolean;
}) {
  const navigate = useNavigate();
  const identity = useIdentity();

  return (
    <div className="flex items-center justify-between flex-col sm:flex-row">
      <div className="flex items-center">
        <div className="flex items-center max-w-[60%] sm:w-auto overflow-hidden mr-2">
          <div
            className="flex items-center cursor-pointer hover:bg-glass-1 px-2 py-1 rounded-full overflow-hidden"
            onClick={() => {
              navigate({
                pathname: '/token-balances',
                search: createSearchParams({
                  address: identity,
                  rawInput: createFormattedRawInput({
                    label: identity,
                    address: identity,
                    type: 'ADDRESS',
                    blockchain: 'ethereum'
                  })
                }).toString()
              });
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
      <div className="self-end  mt-3 sm:mt-0">
        <Tooltip
          disabled={!loading}
          contentClassName="py-2 px-3 bg-secondary mt-3"
          content={
            <div className="text-[10px]">
              please wait for scanning to complete
            </div>
          }
        >
          <div className="flex items-center">
            <span className="hidden sm:inline-flex items-center bg-glass-1 rounded-full">
              <button
                disabled={loading}
                onClick={() => setShowGridView(true)}
                className={classNames(
                  'py-1 px-2.5 disabled:cursor-not-allowed',
                  {
                    'bg-glass border-solid-light rounded-full': showGridView
                  }
                )}
              >
                <Icon name="grid-view" />
              </button>
              <button
                disabled={loading}
                onClick={() => setShowGridView(false)}
                className={classNames(
                  'py-1 px-2.5 disabled:cursor-not-allowed',
                  {
                    'bg-glass border-solid-light rounded-full': !showGridView
                  }
                )}
              >
                <Icon name="list-view" />
              </button>
            </span>
            <ScoreOptions disabled={loading} onApplyScore={onApplyScore} />
          </div>
        </Tooltip>
      </div>
    </div>
  );
}

const MemoizedHeader = memo(Header);

export { MemoizedHeader as Header };
