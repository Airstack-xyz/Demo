import { memo, useState } from 'react';
import classNames from 'classnames';
import { Icon } from '../../Components/Icon';
import { Dropdown } from '../../Components/Dropdown';
import { SCORE_KEY, ScoreMap, scoreOptions, maxScore } from './constants';
import { getDefaultScoreMap } from './utils';
import { Tooltip } from '../../Components/Tooltip';
import classnames from 'classnames';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { useIdentity } from './hooks/useIdentity';
import { createFormattedRawInput } from '../../utils/createQueryParamsWithMention';

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
  onApplyScore: (score: ScoreMap) => void;
  loading?: boolean;
}) {
  const [score, setScore] = useState<ScoreMap>(getDefaultScoreMap);
  const navigate = useNavigate();
  const identity = useIdentity();

  const getScoreHandler = (updateBy: number, key: keyof ScoreMap) => () => {
    setScore(prevScore => {
      const score = prevScore[key] + updateBy;
      const scoreMap = {
        ...prevScore,
        [key]: Math.max(0, Math.min(score, maxScore))
      };
      localStorage.setItem(SCORE_KEY, JSON.stringify(scoreMap));
      return scoreMap;
    });
  };

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
            <Dropdown
              disabled={loading}
              options={scoreOptions}
              optionsContainerClassName="left-auto right-0"
              renderPlaceholder={(_, isOpen) => (
                <button
                  disabled={loading}
                  className={classnames(
                    'bg-glass-1 border-solid-stroke rounded-full flex items-center py-1.5 px-2.5 ml-3 disabled:cursor-not-allowed',
                    {
                      'border-solid-light': isOpen
                    }
                  )}
                >
                  <Icon
                    name="bullseye"
                    width={12}
                    height={12}
                    className="mr-1"
                  />
                  Scoring
                </button>
              )}
              closeOnSelect={false}
              onChange={() => {
                // do nothing
              }}
              footerComponent={
                <div className="flex p-4">
                  <button
                    className="flex bg-button-primary py-2 px-3 rounded-18 mr-4"
                    onClick={() => {
                      onApplyScore(score);
                    }}
                  >
                    Apply
                  </button>
                  <button>Close</button>
                </div>
              }
              renderOption={({ option }) => (
                <>
                  {option.label === scoreOptions[0].label && (
                    <div
                      className="bg-glass px-4 py-4 -mt-1 -mx-1 rounded-t-18 flex items-center justify-between"
                      onClick={e => e.stopPropagation()}
                    >
                      <span>Criteria</span>
                      <span>Score</span>
                    </div>
                  )}
                  <div
                    className="min-w-[313px] flex items-center justify-between p-4"
                    onClick={e => e.stopPropagation()}
                  >
                    <span>{option.label}</span>
                    <span className="flex items-center">
                      <button
                        className="w-5 h-5 rounded-full bg-text-secondary flex items-center justify-center text-secondary text-sm"
                        onClick={getScoreHandler(-1, option.value)}
                      >
                        -
                      </button>
                      <span className="mx-2 text-xs w-4 text-center">
                        {score[option.value]}
                      </span>
                      <button
                        className="w-5 h-5 rounded-full bg-text-secondary flex items-center justify-center text-secondary text-sm"
                        onClick={getScoreHandler(1, option.value)}
                      >
                        +
                      </button>
                    </span>
                  </div>
                </>
              )}
            ></Dropdown>
          </div>
        </Tooltip>
      </div>
    </div>
  );
}

const MemoizedHeader = memo(Header);

export { MemoizedHeader as Header };
