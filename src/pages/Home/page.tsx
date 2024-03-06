import { Search } from '@/Components/Search';
import { MAX_SEARCH_WIDTH } from '@/Components/Search/constants';
import classNames from 'classnames';
import { QuickLinks } from './QuickLinks';
import { Icon as MainIcon } from '@/Components/Icon';
import { Docs } from './Docs';
import { Abstractions } from './Abstractions';
import { Tokens } from './Tokens';
import { Events } from './Events';
import { Socials } from './Socials';
import { Chains } from './Chains';
import { Icon } from './Icon';
import { Partners } from './Partners';
import { LiveIntegrations } from './LiveIntegrations';
import { Hiring } from './Hiring';
import { Team } from './Team';
import { Investors } from './Investors';
import { Footer } from './Footer';

export function HomePage() {
  return (
    <>
      <div
        className={classNames(
          'px-2 pt-5 max-w-[1146px] mx-auto sm:pt-[20vh] flex-1 h-full w-full flex flex-col items-center text-center'
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
              <MainIcon
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
        <Abstractions />
        <div className="w-full mt-5 flex-row-h-center">
          <Tokens />
          <div className="ml-5">
            <Events />
          </div>
        </div>
        <div className="w-full mt-5 flex-row-h-center">
          <Socials />
          <div className="ml-5">
            <Chains />
          </div>
        </div>
        <div className="w-full mt-5 flex-col-h-center">
          <div className="card p-6 rounded-xl flex-row-h-center flex-1">
            {' '}
            <Icon name="ai-query" width={33} height={18} /> AI Query Engine
          </div>
          <div className="card p-6 rounded-xl flex-row-h-center flex-1 ml-5">
            {' '}
            <Icon name="ai-api" width={16} height={16} /> AI APIs (in dev)
          </div>
        </div>
        <div className="max-w-[700px]">
          <div className="mt-40">
            <Partners />
          </div>
          <div className="mt-20">
            <LiveIntegrations />
          </div>
        </div>
        <div className="my-20">
          <Hiring />
        </div>
        <div className="my-20">
          <Team />
        </div>
        <div className="my-20">
          <Investors />
        </div>
      </div>
      <div className="py-10">
        <Footer />
      </div>
    </>
  );
}
