import { Link } from '@/Components/Link';
import { Tooltip, tooltipClass } from '../Tooltip';
import { Image } from '@/Components/Image';
import { Icon } from '../Icon';
import { links } from './constants';
import { MobileDrawer } from './MobileDrawer';
import { Suspense } from 'react';
import { CsvAndLogin } from './CsvAndLogin';

export function Header() {
  return (
    <>
      <header className="fixed bg-glass-1 py-4 z-[100] top-0 left-0 right-0 max-sm:absolute">
        <div className="max-w-screen-lg  mx-auto w-full flex items-center justify-center sm:justify-between px-8">
          <div className="text-xl flex-row-center">
            <Link to="/" className="">
              <Image src="/logo.svg" className="h-[33px] mr-5" />
            </Link>
          </div>
          <div className="hidden sm:flex-row-center text-sm gap-[30px]">
            <Link
              target="_blank"
              to="https://docs.airstack.xyz/airstack-docs-and-faqs/guides/farcaster-frames"
              className="flex items-center gap-2"
            >
              <Icon name="frames" height={30} width={95} />
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
