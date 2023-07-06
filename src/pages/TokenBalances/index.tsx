import { Search } from '../../Components/Search';
import { Poaps } from './Poaps';
import { Socials } from './Socials';
import { Tokens } from './Tokens';

export function TokenBalance() {
  return (
    <div className="min-h-screen w-full flex justify-center">
      <div className="flex flex-col p-16 max-w-[1440px]">
        <div className="flex flex-col items-center">
          <Search />
        </div>
        <div className="my-5">
          Token balances of vitalik.eth
          <span className="text-text-button ml-3.5">
            Get API for this response
          </span>
        </div>
        <div className="flex justify-between">
          <Tokens />
          <aside className="w-80 ml-16">
            <Socials />
            <Poaps />
          </aside>
        </div>
      </div>
    </div>
  );
}
