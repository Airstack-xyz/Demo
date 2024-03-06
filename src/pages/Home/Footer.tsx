import { Image } from '@/Components/Image';
import { Link } from '@/Components/Link';

const links: { name: string; link: string }[] = [
  {
    name: 'docs',
    link: 'https://app.airstack.xyz/docs'
  },
  {
    name: 'aPI',
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
              <Image src={`images/home/${link.name}.svg`} height={30} />
            </Link>
          );
        })}
      </div>
    </footer>
  );
}
