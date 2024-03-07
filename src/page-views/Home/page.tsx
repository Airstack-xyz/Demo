import { Search } from '@/Components/Search';
import { MAX_SEARCH_WIDTH } from '@/Components/Search/constants';
import classNames from 'classnames';
import { QuickLinks } from './components/QuickLinks';
import { Icon as MainIcon } from '@/Components/Icon';
import { Docs } from './components/Docs';
import { Abstractions } from './components/Abstractions';
import { Tokens } from './components/Tokens';
import { Events } from './components/Events';
import { Socials } from './components/Socials';
import { Chains } from './components/Chains';
import { Partners } from './components/Partners';
import { LiveIntegrations } from './components/LiveIntegrations';
import { Careers } from './components/Careers/Careers';
import { Team } from './components/Team';
import { Investors } from './components/Investors';
import { Footer } from './components/Footer';
import { Suspense } from 'react';
import { SdkInit } from './components/SdkInit';
import { QueryAndAiLinks } from './components/QueryAndAiLinks';

export function HomePage() {
  return (
    <>
      <Suspense>
        <SdkInit />
      </Suspense>
      <div
        className={classNames(
          'px-2 pt-5 max-w-[1146px] mx-auto sm:pt-[20vh] flex-1 h-full w-full flex flex-col items-center text-center'
        )}
      >
        <div style={{ maxWidth: MAX_SEARCH_WIDTH }} className="mx-auto w-full">
          <h1 className="text-[44px]">Explore Onchain</h1>
          <div className="flex justify-center">
            <div className="w-[850px] max-w-[850px]">
              <Suspense>
                <Search />
              </Suspense>
            </div>
          </div>
          <QuickLinks />
        </div>
        <div className="mt-32 sm:mt-52">
          <h2 className="text-[22px] sm:text-[44px] leading-relaxed flex flex-col font-semibold">
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
          <div className="text-[#868D94] text-base sm:text-2xl mt-4">
            Powerful for developers. Easy for Everyone!
          </div>
        </div>
        <div className="mt-14 mb-52">
          <Docs />
        </div>
        <div className="mb-14">
          <h2 className="text-[22px] sm:text-4xl font-semibold !leading-relaxed max-w-[830px]">
            Discover why 1,720 builders rely on Airstack for billions of API
            responses monthly
          </h2>
        </div>
        <Abstractions />
        <div className="w-full mt-5 flex flex-col sm:flex-row sm:items-center">
          <Tokens />
          <div className="ml-0 sm:ml-5 mt-5 sm:mt-0">
            <Events />
          </div>
        </div>
        <div className="w-full mt-5 flex flex-col sm:flex-row sm:items-center">
          <Socials />
          <div className="ml-0 sm:ml-5 mt-5 sm:mt-0">
            <Chains />
          </div>
        </div>
        <div className="w-full mt-5">
          <QueryAndAiLinks />
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
          <Careers />
        </div>
        <div className="my-20">
          <Team />
        </div>
        <div className="my-20">
          <Investors />
        </div>
      </div>
      <div className="pt-10">
        <Footer />
      </div>
    </>
  );
}
