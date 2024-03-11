import { Link } from '@/Components/Link';
import { createTokenBalancesUrl } from '../../../../utils/createTokenUrl';
import { isMobileDevice } from '../../../../utils/isMobileDevice';
import { Domain, Social } from '../../../TokenBalances/types';
import { MatchInfo } from './MatchInfo';
import { Profile } from './Profile';
import { ScoreContainer } from './ScoreContainer';

export function Score({
  score,
  domains,
  socials,
  isLoading
}: {
  score: number;
  domains: [Domain | null, Domain | null];
  socials: [Social | null, Social | null];
  isLoading: boolean;
}) {
  const isMobile = isMobileDevice();

  return (
    <div className="bg-glass flex justify-center items-center w-full sm:w-[480px] h-full px-3 sm:px-7 py-7 rounded-tl-18 rounded-bl-none sm:rounded-bl-18 z-10">
      <div className="flex mt-0 sm:mt-2">
        <div className="flex flex-col items-center relative text-center">
          <Link
            to={createTokenBalancesUrl({
              address: domains[0]?.name || '',
              blockchain: 'ethereum',
              inputType: 'ADDRESS',
              truncateLabel: isMobile
            })}
            className="cursor-pointer transform transition duration-200 hover:scale-110 w-[69px] sm:w-[80px] h-[69px] sm:h-[80px] rounded-full overflow-hidden border-[1.5px] border-solid border-text-button flex items-center justify-center [&>img]:max-w-[150%] [&>img]:w-[150%]"
          >
            <Profile social={socials[0]} domain={domains[0]} />
          </Link>
          <div className="mt-2.5 text-xs sm:text-sm font-medium w-24 ellipsis">
            {domains[0]?.name}
          </div>
        </div>
        <div className="relative flex justify-center pb-6 mx-3">
          <ScoreContainer score={score} isLoading={isLoading} />
          <MatchInfo />
        </div>
        <div className="flex flex-col items-center relative text-center">
          <Link
            to={createTokenBalancesUrl({
              address: domains[1]?.name || '',
              blockchain: 'ethereum',
              inputType: 'ADDRESS',
              truncateLabel: isMobile
            })}
            className="cursor-pointer transform transition duration-200 hover:scale-110 w-[69px] sm:w-[80px] h-[69px] sm:h-[80px] rounded-full overflow-hidden border-[1.5px] border-solid border-button-primary flex items-center justify-center [&>img]:max-w-[150%] [&>img]:w-[150%]"
          >
            <Profile social={socials[1]} domain={domains[1]} />
          </Link>
          <div className="mt-2.5 text-xs sm:text-sm font-medium w-24 ellipsis">
            {domains[1]?.name}
          </div>
        </div>
      </div>
    </div>
  );
}
