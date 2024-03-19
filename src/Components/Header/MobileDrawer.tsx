'use client';
import { useEffect, useState } from 'react';
import { Icon } from '../Icon';
import classNames from 'classnames';
import { Link } from '../Link';
import { links } from './constants';

export function MobileDrawer({}) {
  const [showNavbar, setShowNavbar] = useState(false);

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
      <button
        className="sm:hidden flex absolute right-5 top-5 z-[101]"
        onClick={() => {
          setShowNavbar(!showNavbar);
        }}
      >
        <Icon
          name={showNavbar ? 'close' : 'hamburger'}
          className={showNavbar ? 'size-4 mr-1 mt-1' : 'size-6'}
        />
      </button>
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
            <li className="pt-9">
              <Link
                to="/leaderboard"
                className="font-semibold py-2"
                onClick={() => {
                  setShowNavbar(false);
                }}
              >
                Leaderboard
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

export default MobileDrawer;
