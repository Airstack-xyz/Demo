import { Social } from '../../../TokenBalances/types';
import { Profile } from './Profile';
import { ScoreContainer } from './ScoreContainer';
import { MatchInfo } from './MatchInfo';

export function Score({
  score,
  domains,
  socials
}: {
  score: number;
  domains: string[];
  socials: [Social | null, Social | null];
}) {
  return (
    <div className="bg-transparent sm:bg-glass flex justify-center items-center h-full p-3 sm:p-7 rounded-l-18 z-10 w-full sm:w-auto mt-2 sm:mt-0">
      <div className="flex flex-col items-center relative">
        <div className="w-[80px] h-[80px] rounded-full overflow-hidden border-[1.5px] border-solid border-text-button flex items-center justify-center [&>img]:max-w-[150%] [&>img]:w-[150%]">
          <Profile social={socials[0]} />
        </div>
        <div className="mt-2.5 text-xs font-medium absolute -bottom-6">
          {domains[0]}
        </div>
      </div>
      <div className="relative flex justify-center">
        <ScoreContainer score={score} />
        <MatchInfo />
      </div>
      <div className="flex flex-col items-center relative">
        <div className="w-[80px] h-[80px] rounded-full overflow-hidden border-[1.5px] border-solid border-button-primary flex items-center justify-center [&>img]:max-w-[150%] [&>img]:w-[150%]">
          <Profile social={socials[1]} />
        </div>
        <div className="mt-2.5 text-xs font-medium absolute -bottom-6">
          {domains[1]}
        </div>
      </div>
    </div>
  );
}
