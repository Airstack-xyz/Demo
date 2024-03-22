import classnames from 'classnames';
import { useState } from 'react';
import { Icon } from '../../../Components/Icon';
import { SCORE_KEY, ScoreMap, MAX_SCORE, scoreOptions } from '../constants';
import { getDefaultScoreMap } from '../utils';
import { useOutsideClick } from '../../../hooks/useOutsideClick';
import { Image } from '@/Components/Image';

export function ScoreOptions({
  disabled,
  onApplyScore
}: {
  disabled?: boolean;
  onApplyScore: (score: ScoreMap) => Promise<void>;
}) {
  const [sorting, setSorting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [score, setScore] = useState<ScoreMap>(getDefaultScoreMap);
  const containerRef = useOutsideClick<HTMLDivElement>(() => setIsOpen(false));

  const getScoreHandler = (updateBy: number, key: keyof ScoreMap) => () => {
    setScore(prevScore => {
      const score = prevScore[key] + updateBy;
      const scoreMap = {
        ...prevScore,
        [key]: Math.max(0, Math.min(score, MAX_SCORE))
      };
      localStorage.setItem(SCORE_KEY, JSON.stringify(scoreMap));
      return scoreMap;
    });
  };
  return (
    <div className="relative inline-flex text-xs" ref={containerRef}>
      <button
        disabled={disabled}
        className={classnames(
          'button-filter rounded-full flex items-center py-1.5 px-2.5 ml-3 disabled:cursor-not-allowed',
          {
            'border-solid-light': isOpen
          }
        )}
        onClick={() => setIsOpen(isOpen => !isOpen)}
      >
        <Icon name="bullseye" width={12} height={12} className="mr-1" />
        Scoring
      </button>
      {isOpen && (
        <div className="absolute top-[120%] right-0 z-20 bg-dropdown rounded-18 overflow-hidden">
          <div
            className="bg-tertiary px-4 py-4 -mt-1 -mx-1 rounded-t-18 flex items-center justify-between"
            onClick={e => e.stopPropagation()}
          >
            <span>Criteria</span>
            <span>Score</span>
          </div>
          {scoreOptions.map(option => (
            <div
              key={option.value}
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
          ))}
          <div className="flex p-4" onClick={e => e.stopPropagation()}>
            <button
              disabled={sorting}
              className="flex button-primary py-2 px-3 rounded-18 mr-4 w-14 justify-center items-center "
              onClick={async () => {
                setSorting(true);
                await onApplyScore(score);
                setSorting(false);
                setIsOpen(false);
              }}
            >
              {sorting ? (
                <Image src="images/spinner.gif" width={15} />
              ) : (
                <>Apply</>
              )}
            </button>
            <button
              disabled={sorting}
              onClick={async () => {
                setIsOpen(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
