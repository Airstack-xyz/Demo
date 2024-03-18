import { Icon, IconType } from '@/Components/Icon';
import { Image } from '@/Components/Image';
import { Link } from './Link';
import { GlowImage } from '@/Components/GlowImage';

const links: { icon: IconType; link: string }[] = [
  {
    icon: 'docs',
    link: 'https://docs.airstack.xyz'
  },
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
    <>
      <footer className="flex flex-col sm:flex-row justify-between items-center content px-8 overflow-hidden">
        <Link to="https://app.airstack.xyz" className="" target="_blank">
          <Image src="/logo.svg" className=" h-[50px] sm:h-[33px] mr-5" />
        </Link>
        <div className="flex gap-8 sm:gap-1 flex-wrap items-center sm:mt-0 mt-10 [&>*]:ml-10">
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
      <GlowImage
        className="absolute -bottom-1/2 w-screen pointer-events-none z-"
        position="bottom"
      />
    </>
  );
}
