import { Link } from '@/Components/Link';
import { HeadingWithIcon } from './HeadingWithIcon';

const links = [
  {
    name: 'Build Farcaster Frames',
    link: ''
  },
  {
    name: 'Farcaster APIs',
    link: ''
  },
  {
    name: 'No-code Frames',
    link: ''
  },
  {
    name: 'Onchain Composability APIs',
    link: ''
  }
];

export function QuickLinks() {
  return (
    <div className="">
      <HeadingWithIcon icon="quick-link" title="Quick links" />
      <ul className="border border-solid border-stroke-color-light mt-5 p-5 rounded-18 flex flex-col gap-7 text-sm text-text-button">
        {links.map(link => (
          <li key={link.name}>
            <Link to={link.link} className="py-1">
              {link.name} {'->'}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
