const links = [
  {
    label: 'Onchain Kit for Farcaster Frames',
    link: 'https://docs.airstack.xyz/airstack-docs-and-faqs/guides/farcaster/airstack-onchain-kit-for-farcaster-frames'
  },
  {
    label: 'Farcaster APIs',
    link: 'https://docs.airstack.xyz/airstack-docs-and-faqs/guides/farcaster'
  },
  {
    label: 'No-code Frames',
    link: ''
  },
  {
    label: 'Onchain Composability APIs',
    link: 'https://docs.airstack.xyz/airstack-docs-and-faqs/'
  }
];

export function QuickLinks() {
  return (
    <ul className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-center flex-wrap gap-3 sm:gap-9 mt-8">
      {links.map(({ label, link }) => (
        <li key={label} className="text-text-button bg-[#ffffff0d] rounded-18">
          <a
            href={link}
            className="inline-block h-full w-full py-1 px-3 text-sm"
          >
            {label} {'->'}
          </a>
        </li>
      ))}
    </ul>
  );
}
