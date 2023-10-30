import { useMemo } from 'react';
import { Icon } from '../../../../Components/Icon';
import { scoreOptions } from '../../constants';
import { getDefaultScoreMap } from '../../utils';

export function MatchInfo() {
  const scoreMap = useMemo(() => getDefaultScoreMap(), []);
  return (
    <div className="flex items-center absolute -bottom-0">
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
  );
}
