import { Search } from '@/Components/Search';
import { MAX_SEARCH_WIDTH } from '@/Components/Search/constants';
import classNames from 'classnames';
import { QuickLinks } from './QuickLinks';
import { Icon } from '@/Components/Icon';
import { Docs } from './Docs';
import { Abstractions } from './Abstractions';
import { Tokens } from './Tokens';

export function HomePage() {
  return (
    <div
      className={classNames(
        'px-2 pt-5 max-w-[1130px] mx-auto sm:pt-[20vh] flex-1 h-full w-full flex flex-col items-center text-center'
      )}
    >
      <div style={{ maxWidth: MAX_SEARCH_WIDTH }} className="mx-auto w-full">
        <h1 className="text-[44px]">Explore Onchain</h1>
        <div className="flex justify-center">
          <div className="w-[850px] max-w-[850px]">
            <Search />
          </div>
        </div>
        <QuickLinks />
      </div>
      <div className="mt-52">
        <h2 className="text-[44px] leading-relaxed flex flex-col">
          <span>Airstack is the easiest</span>
          <span className="flex items-center">
            <span>way to build on</span>
            <Icon
              name="farcaster"
              height={52}
              width={52}
              className="rounded-lg mx-2"
            />
            <span>Farcaster</span>
          </span>
        </h2>
        <div className="text-[#868D94] text-2xl mt-4">
          Powerful for developers. Easy for Everyone!
        </div>
      </div>
      <div className="mt-14 mb-52">
        <Docs />
      </div>
      <div className="mb-14">
        <h2 className="text-4xl font-semibold leading-relaxed">
          Discover why 1,720 builders rely on Airstack <br /> for billions of
          API responses monthly
        </h2>
      </div>
      <div className="w-full">
        <Abstractions />
      </div>
      <div className="w-full mt-5">
        <Tokens />
      </div>
    </div>
  );
}
