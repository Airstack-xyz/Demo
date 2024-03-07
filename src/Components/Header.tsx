'use client';
import { Link } from '@/Components/Link';
import { useAuth } from '../hooks/useAuth';
import { CSVDownloads } from './CSVDownload/CSVDownloads';
import { Profile } from './Profile';
import { Tooltip, tooltipClass } from './Tooltip';
import { Image } from '@/Components/Image';
import { Icon, IconType } from './Icon';

const links: { name: IconType; link: string; description: string }[] = [
  {
    name: 'api',
    link: 'https://app.airstack.xyz/api-studio',
    description: ''
  },
  {
    name: 'sdk',
    link: 'https://app.airstack.xyz/sdks',
    description: ''
  },
  {
    name: 'github',
    link: 'https://github.com/Airstack-xyz/Demo',
    description: ''
  }
];

export function Header() {
  const { user, login } = useAuth();

  return (
    <header className="fixed bg-glass-1 py-4 z-[100] top-0 left-0 right-0 max-sm:absolute">
      <div className="max-w-[1440px] mx-auto w-full flex items-center justify-center sm:justify-between px-8">
        <div className="text-xl flex-row-center">
          <Link to="/" className="" target="_blank">
            <Image src="/logo.svg" className="h-[33px] mr-5" />
          </Link>
        </div>
        <div className="hidden sm:flex-row-center text-sm gap-[30px]">
          <Link
            to="https://docs.airstack.xyz/airstack-docs-and-faqs/guides/farcaster-frames"
            className="flex items-center gap-2"
          >
            <Icon name="frames" height={30} width={40} />
          </Link>
          {user && <CSVDownloads />}
          {links.map((link, index) => (
            <Tooltip
              content={link.description}
              key={index}
              contentClassName={tooltipClass}
            >
              <Link to={link.link} className="flex items-center gap-2">
                <Icon name={link.name} height={30} width={40} />
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
      </div>
    </header>
  );
}
