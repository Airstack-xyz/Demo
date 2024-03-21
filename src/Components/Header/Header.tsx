import { Link } from '@/Components/Link';
import { Tooltip, tooltipClass } from '../Tooltip';
import { Image } from '@/Components/Image';
import { Icon } from '../Icon';
import { links } from './constants';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { GlowImage } from '../GlowImage';

const MobileDrawer = dynamic(() => import('./MobileDrawer'), {
  ssr: false
});

const CsvAndLogin = dynamic(() => import('./CsvAndLogin'), {
  ssr: false,
  loading: () => (
    <button
      className="h-[30px] px-10 rounded-18 hover:opacity-90 skeleton-loader"
      data-loader-type="block"
    ></button>
  )
});

export function Header() {
  return (
    <>
      <GlowImage
        className="absolute w-screen top-0 pointer-events-none"
        position="top"
      />
      <header className="fixed bg-header py-4 z-[100] top-0 left-0 right-0 max-sm:absolute flex justify-center  pr-2 pl-2 sm:pr-6 sm:pl-16">
        <div className="content flex items-center justify-center sm:justify-between">
          <div className="text-xl flex-row-center">
            <Link to="/" className="">
              <Image src="/logo.svg" className="h-[33px] mr-5" />
            </Link>
          </div>
          <div className="hidden sm:flex-row-center text-xs gap-[30px]">
            <Link
              target="_blank"
              to="https://docs.airstack.xyz/airstack-docs-and-faqs/guides/farcaster-frames"
              className="flex items-center gap-1 px-2.5 py-1.5 -mr-2.5 rounded-18 overflow-hidden hover:header-btn-bg"
            >
              <span className="rounded-sm header-btn-bg py-1.5 px-2 sm:py-0 sm:px-0">
                <Icon
                  name="farcaster"
                  height={14.5}
                  width={14.5}
                  className="rounded-sm"
                />
              </span>
              <span className="text-text-button font-semibold">Frames</span>
            </Link>
            <Link
              to="/leaderboard"
              className="font-semibold px-2.5 py-1.5 hover:header-btn-bg rounded-18 -mx-2.5"
            >
              Leaderboard
            </Link>

            {links.map((link, index) => (
              <Tooltip
                content={link.description}
                key={index}
                contentClassName={tooltipClass}
              >
                <Link
                  target="_blank"
                  to={link.link}
                  className="flex items-center gap-2"
                >
                  <Icon
                    name={link.icon}
                    height={30}
                    width={40}
                    className="w-auto"
                  />
                </Link>
              </Tooltip>
            ))}

            <Suspense>
              <CsvAndLogin />
            </Suspense>
          </div>
        </div>
      </header>
      <Suspense>
        <MobileDrawer />
      </Suspense>
    </>
  );
}
