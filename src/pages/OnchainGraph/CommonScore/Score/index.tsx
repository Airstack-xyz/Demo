import { Domain, Social } from '../../../TokenBalances/types';
import { Profile } from './Profile';
import { ScoreContainer } from './ScoreContainer';
import { MatchInfo } from './MatchInfo';
import { createTokenBalancesUrl } from '../../../../utils/createTokenUrl';
import { Link } from 'react-router-dom';

export function Score({
  score,
  domains,
  socials
}: {
  score: number;
  domains: [Domain | null, Domain | null];
  socials: [Social | null, Social | null];
}) {
  return (
    <div className="bg-transparent sm:bg-glass flex justify-center items-center h-full p-3 sm:p-7 rounded-l-18 z-10 w-full sm:w-auto mt-2 sm:mt-0">
      <div className="flex mt-0 sm:mt-2">
        <div className="flex flex-col items-center relative">
          <Link
            to={createTokenBalancesUrl({
              address: domains[0]?.name || '',
              blockchain: 'ethereum',
              inputType: 'ADDRESS'
            })}
            className="cursor-pointer transform transition duration-200 hover:scale-110 w-[80px] h-[80px] rounded-full overflow-hidden border-[1.5px] border-solid border-text-button flex items-center justify-center [&>img]:max-w-[150%] [&>img]:w-[150%]"
          >
            <Profile social={socials[0]} domain={domains[0]} />
          </Link>
          <div className="mt-2.5 text-xs font-medium">{domains[0]?.name}</div>
        </div>
        <div className="relative flex justify-center pb-6">
          <ScoreContainer score={score} />
          <MatchInfo />
        </div>
        <div className="flex flex-col items-center relative">
          <Link
            to={createTokenBalancesUrl({
              address: domains[1]?.name || '',
              blockchain: 'ethereum',
              inputType: 'ADDRESS'
            })}
            className="cursor-pointer transform transition duration-200 hover:scale-110 w-[80px] h-[80px] rounded-full overflow-hidden border-[1.5px] border-solid border-button-primary flex items-center justify-center [&>img]:max-w-[150%] [&>img]:w-[150%]"
          >
            <Profile social={socials[1]} domain={domains[1]} />
          </Link>
          <div className="mt-2.5 text-xs font-medium">{domains[1]?.name}</div>
        </div>
      </div>
    </div>
  );
}
