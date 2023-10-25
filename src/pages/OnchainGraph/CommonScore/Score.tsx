import { useMemo } from 'react';
import { Icon } from '../../../Components/Icon';
import { ScoreBar } from './ScoreBar';
import { getDefaultScoreMap } from '../OnChainGraph/utils';
import { scoreOptions } from '../OnChainGraph/constants';

export function Score({ score }: { score: number }) {
  const scoreMap = useMemo(() => getDefaultScoreMap(), []);

  return (
    <div className="bg-glass flex flex-col justify-center h-full p-7 rounded-l-18 z-10">
      <h3 className="text-[28px] font-semibold">{score}</h3>
      <div className="mt-2.5 mb-2">
        <ScoreBar scorePercentage={70} />
      </div>
      <div className="flex items-center">
        <span className="text-xs text-text-secondary mr-1">on-chain match</span>
        <div className="relative">
          <Icon name="info-circle" height={14} width={14} className="peer" />
          <div className="bg-tertiary z-10 text-xs absolute w-[270px] leading-loose rounded-18 hidden peer-hover:block hover:block pb-2">
            <div className="px-5 py-2 font-bold">
              How’s this score calculated?
            </div>
            <div className="bg-glass flex items-center justify-between px-5 py-2 text-text-secondary font-medium">
              <div>Criteria</div>
              <div>Score</div>
            </div>
            {scoreOptions.map(option => (
              <div
                className="flex items-center justify-between px-5 py-2"
                key={option.value}
              >
                <div>{option.label}</div>
                <div>{scoreMap[option.value]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
