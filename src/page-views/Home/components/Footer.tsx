import { Icon, IconType } from '@/Components/Icon';
import { Image } from '@/Components/Image';
import { Link } from './Link';

const links: { icon: IconType; link: string }[] = [
  // {
  //   icon: 'docs',
  //   link: 'https://app.airstack.xyz/docs'
  // },
  {
    icon: 'api',
    link: 'https://app.airstack.xyz/api-studio'
  },
  {
    icon: 'sdk',
    link: 'https://app.airstack.xyz/sdks'
  },
  {
    icon: 'github',
    link: 'https://app.airstack.xyz/sdks'
  },
  {
    icon: 'warpcast',
    link: 'https://warpcast.com/~/channel/airstack'
  },
  {
    icon: 'x',
    link: 'https://twitter.com/airstack_xyz'
  },
  {
    icon: 'linkedin',
    link: 'https://www.linkedin.com/company/airstack-xyz'
  }
];

export function Footer() {
  return (
    <div className="bg-[url('/images/glow.svg')]">
      <footer className="flex flex-col sm:flex-row justify-between items-center max-w-[1440px] mx-auto w-full px-8">
        <Link to="https://app.airstack.xyz" className="" target="_blank">
          <Image src="/logo.svg" className=" h-[50px] sm:h-[33px] mr-5" />
        </Link>
        <div className="flex gap-8 flex-wrap items-center sm:mt-0 mt-10 [&>*]:ml-10">
          {links.map((link, index) => {
            return (
              <Link
                key={index}
                to={link.link}
                className="flex items-center gap-2"
              >
                <Icon
                  name={link.icon}
                  height={30}
                  className="w-auto h-[30px]"
                />
              </Link>
            );
          })}
        </div>
      </footer>
    </div>
  );
}
