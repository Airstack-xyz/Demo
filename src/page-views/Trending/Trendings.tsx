import { Mints } from './Mints';
import { Tokens } from './Tokens';
import { AirstackFrames } from './AirstackFrames';
import { Casts } from './Casts';
import { QuickLinks } from './QuickLinks';
import { MemeCoins } from './MemeCoins';
import { MintsNow } from './MintsNow';

export function Trendings() {
  return (
    <div className="flex gap-10">
      <div className="max-w-[944px] w-full">
        <AirstackFrames />
        <div className="pt-16"></div>
        <Mints />
        <div className="pt-16"></div>
        <Casts />
        <div className="pt-16"></div>
        <Tokens />
      </div>
      <div className="w-[326px]">
        <QuickLinks />
        <div className="pt-16"></div>
        <MemeCoins />
        <div className="pt-16"></div>
        <MintsNow />
      </div>
    </div>
  );
}
