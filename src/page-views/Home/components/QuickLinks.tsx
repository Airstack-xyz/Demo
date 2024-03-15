import { Link } from './Link';

const links = [
  {
    label: 'Build Farcaster Frames',
    link: 'https://docs.airstack.xyz/airstack-docs-and-faqs/guides/farcaster-frames'
  },
  {
    label: 'Farcaster APIs',
    link: 'https://docs.airstack.xyz/airstack-docs-and-faqs/guides/farcaster'
  },
  {
    label: 'No-code Frames',
    link: 'https://docs.airstack.xyz/airstack-docs-and-faqs/guides/no-code-frames'
  },
  {
    label: 'Onchain Composability APIs',
    link: 'https://docs.airstack.xyz/airstack-docs-and-faqs/'
  }
];

export function QuickLinks() {
  return (
    <ul className="flex flex-row items-center justify-center flex-wrap gap-y-3.5 gap-x-1 sm:gap-x-3.5 mt-8">
      {links.map(({ label, link }) => (
        <li
          key={label}
          className="text-text-button bg-transparent sm:bg-[#ffffff0d] rounded-18"
        >
          <Link
            to={link}
            className="inline-block h-full w-full py-1 px-2 sm:px-3 text-[10px] sm:text-base"
          >
            {label} <span className="hidden sm:inline">{'->'}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
