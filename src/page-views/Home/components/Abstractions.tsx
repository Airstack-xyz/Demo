import { Icon, IconType } from './Icon';

const modules: {
  name: string;
  icon: IconType;
  link: string;
}[] = [
  {
    name: 'Farcaster Frames',
    icon: 'facaster-frames',
    link: ''
  },
  {
    name: 'Allow List',
    icon: 'allow-list',
    link: ''
  },
  {
    name: 'Recommended Mints',
    icon: 'recommended-mints',
    link: ''
  },
  {
    name: 'Recommended Users',
    icon: 'recommended-users',
    link: ''
  },
  {
    name: 'Recommended Tokens',
    icon: 'recommended-tokens',
    link: ''
  },
  {
    name: 'Recommended Dapps (in dev)',
    icon: 'recommeded-daps',
    link: ''
  },
  {
    name: 'Recommended Swaps (in dev)',
    icon: 'recommended-swaps',
    link: ''
  },
  {
    name: 'Onchain Graph',
    icon: 'on-chain-graph',
    link: ''
  },
  {
    name: 'Universal Contacts',
    icon: 'universal-contacts',
    link: ''
  },
  {
    name: 'Combinations',
    icon: 'combinations',
    link: ''
  },
  {
    name: 'Tokens in Common',
    icon: 'tokens-common',
    link: ''
  },
  {
    name: 'Lookalikes',
    icon: 'lookalikes',
    link: ''
  },
  {
    name: 'Social Follows',
    icon: 'social-follows',
    link: ''
  },
  {
    name: 'Historical Snapshots',
    icon: 'historical-snapshot',
    link: ''
  },
  {
    name: 'Spam Filters',
    icon: 'spam-filter',
    link: ''
  },
  {
    name: 'EVM & Solana Resolvers',
    icon: 'resolvers',
    link: ''
  }
];

export function Abstractions() {
  return (
    <div className="card p-7 rounded-18 w-full">
      <h3 className="text-left font-bold mb-5 flex items-center">
        <Icon name="abstraction-modules" />
        <span className="ml-1.5">Abstraction Modules</span>
      </h3>
      <ul className="grid grid-cols-4 gap-3.5">
        {modules.map(({ name, icon, link }) => (
          <li
            key={name}
            className="card-light h-12 py-3 px-2.5 rounded-xl w-64"
          >
            <a href={link} className="flex items-center font-semibold text-sm">
              <Icon name={icon} />
              <span className="ml-1.5">{name}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
