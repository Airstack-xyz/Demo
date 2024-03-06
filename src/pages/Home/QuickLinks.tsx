const links = [
  {
    label: 'Onchain Kit for Farcaster Frames',
    link: ''
  },
  {
    label: 'Farcaster APIs',
    link: ''
  },
  {
    label: 'No-code Frames',
    link: ''
  },
  {
    label: 'Onchain Composability APIs',
    link: ''
  }
];

export function QuickLinks() {
  return (
    <ul className="flex items-center justify-center flex-wrap gap-9 mt-8">
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
