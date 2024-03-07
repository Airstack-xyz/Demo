import { Icon, IconType } from '@/Components/Icon';
import { Image } from '@/Components/Image';
import { Link } from '@/Components/Link';

const links: { name: IconType; link: string }[] = [
  {
    name: 'docs',
    link: 'https://app.airstack.xyz/docs'
  },
  {
    name: 'api',
    link: 'https://app.airstack.xyz/api-studio'
  },
  {
    name: 'sdk',
    link: 'https://app.airstack.xyz/sdks'
  },
  {
    name: 'github',
    link: ''
  },
  {
    name: 'warpcast',
    link: ''
  },
  {
    name: 'x',
    link: ''
  },
  {
    name: 'linkedin',
    link: ''
  }
];

export function Footer() {
  return (
    <footer className="flex justify-between items-center max-w-[1440px] mx-auto w-full">
      <Link to="https://app.airstack.xyz" className="" target="_blank">
        <Image src="/logo.svg" className="h-[33px] mr-5" />
      </Link>
      <div className="flex items-center [&>*]:ml-10">
        {links.map((link, index) => {
          return (
            <Link
              key={index}
              to={link.link}
              className="flex items-center gap-2"
            >
              <Icon name={link.name} height={30} className="w-auto h-[30px]" />
            </Link>
          );
        })}
      </div>
    </footer>
  );
}
