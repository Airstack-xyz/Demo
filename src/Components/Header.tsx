'use client';
import { Link } from '@/Components/Link';
import { useAuth } from '../hooks/useAuth';
import { CSVDownloads } from './CSVDownload/CSVDownloads';
import { Profile } from './Profile';
import { Tooltip, tooltipClass } from './Tooltip';
import { Image } from '@/Components/Image';
import { Icon, IconType } from './Icon';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { AuthProvider } from '@/context/auth';

const links: {
  icon: IconType;
  name: string;
  link: string;
  description: string;
}[] = [
  {
    icon: 'api',
    name: 'API Studio',
    link: 'https://app.airstack.xyz/api-studio',
    description: ''
  },
  {
    icon: 'sdk',
    name: 'SDKs',
    link: 'https://app.airstack.xyz/sdks',
    description: ''
  },
  {
    icon: 'docs',
    name: 'Docs',
    link: 'https://app.airstack.xyz/docs',
    description: ''
  }
];

function HeaderComponent() {
  const [showNavbar, setShowNavbar] = useState(false);
  const { user, login } = useAuth();

  useEffect(() => {
    if (showNavbar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showNavbar]);

  return (
    <>
      <header className="fixed bg-glass-1 py-4 z-[100] top-0 left-0 right-0 max-sm:absolute">
        <div className="max-w-[1440px] mx-auto w-full flex items-center justify-center sm:justify-between px-8">
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
            {user && <CSVDownloads />}
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
            {user ? (
              <Profile />
            ) : (
              <button
                className="h-[30px] border border-solid border-white px-5 rounded-18 hover:opacity-90"
                onClick={() => {
                  login();
                }}
              >
                Sign In
              </button>
            )}
          </div>
          <button
            className="sm:hidden flex absolute right-10"
            onClick={() => {
              setShowNavbar(!showNavbar);
            }}
          >
            <Icon
              name={showNavbar ? 'close' : 'hamburger'}
              className={showNavbar ? 'size-5' : 'size-6'}
            />
          </button>
        </div>
      </header>
      <nav
        className={classNames(
          'fixed inset-0 pt-16 z-50 block sm:hidden pointer-events-none',
          {
            'pointer-events-auto': showNavbar
          }
        )}
      >
        <div className="h-full flex flex-col items-end">
          <div
            className={classNames('bg-[#061523] fixed inset-0 opacity-0', {
              'opacity-80 pointer-events-auto': showNavbar
            })}
            onClick={() => {
              setShowNavbar(false);
            }}
          ></div>
          <ul
            className={classNames(
              'pt-10 px-7 card h-full z-10 relative transform-gpu transition-transform duration-300 ease-in-out',
              {
                'translate-x-0': showNavbar,
                'translate-x-full': !showNavbar
              }
            )}
          >
            <li>
              <Link
                target="_blank"
                to="https://docs.airstack.xyz/airstack-docs-and-faqs/guides/farcaster-frames"
                className="flex items-center gap-2"
              >
                <Icon name="frames" height={30} width={95} />
              </Link>
            </li>
            {links.map((link, index) => (
              <li key={index} className="mt-9">
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
                  />{' '}
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}

export function Header() {
  return (
    <AuthProvider>
      <HeaderComponent />
    </AuthProvider>
  );
}
