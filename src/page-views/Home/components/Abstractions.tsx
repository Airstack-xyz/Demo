import { Icon, IconType } from './Icon';

const modules: {
  name: string;
  icon: IconType;
  link: string;
}[] = [
  {
    name: 'Farcaster Frames',
    icon: 'facaster-frames',
    link: 'https://docs.airstack.xyz/airstack-docs-and-faqs/guides/farcaster/airstack-onchain-kit-for-farcaster-frames'
  },
  {
    name: 'Allow List',
    icon: 'allow-list',
    link: 'https://docs.airstack.xyz/airstack-docs-and-faqs/guides/farcaster/proof-of-personhood-for-farcaster-frames'
  },
  {
    name: 'Recommended Mints',
    icon: 'recommended-mints',
    link: 'https://docs.airstack.xyz/airstack-docs-and-faqs/guides/trending-mints'
  },
  {
    name: 'Recommended Users',
    icon: 'recommended-users',
    link: 'https://docs.airstack.xyz/airstack-docs-and-faqs/guides/recommend-users'
  },
  {
    name: 'Recommended Tokens',
    icon: 'recommended-tokens',
    link: 'https://app.airstack.xyz'
  },
  {
    name: 'Recommended Dapps (in dev)',
    icon: 'recommeded-daps',
    link: 'https://app.airstack.xyz'
  },
  {
    name: 'Recommended Swaps (in dev)',
    icon: 'recommended-swaps',
    link: 'https://app.airstack.xyz'
  },
  {
    name: 'Onchain Graph',
    icon: 'on-chain-graph',
    link: 'https://docs.airstack.xyz/airstack-docs-and-faqs/guides/onchain-graph'
  },
  {
    name: 'Universal Contacts',
    icon: 'universal-contacts',
    link: 'https://docs.airstack.xyz/airstack-docs-and-faqs/guides/onchain-contacts'
  },
  {
    name: 'Combinations',
    icon: 'combinations',
    link: 'https://docs.airstack.xyz/airstack-docs-and-faqs/guides/combinations'
  },
  {
    name: 'Tokens in Common',
    icon: 'tokens-common',
    link: 'https://docs.airstack.xyz/airstack-docs-and-faqs/guides/tokens-in-common'
  },
  {
    name: 'Lookalikes',
    icon: 'lookalikes',
    link: 'https://docs.airstack.xyz/airstack-docs-and-faqs/guides/onchain-graph'
  },
  {
    name: 'Social Follows',
    icon: 'social-follows',
    link: 'https://docs.airstack.xyz/airstack-docs-and-faqs/guides/social-follows'
  },
  {
    name: 'Historical Snapshots',
    icon: 'historical-snapshot',
    link: 'https://docs.airstack.xyz/airstack-docs-and-faqs/guides/balance-snapshots'
  },
  {
    name: 'Spam Filters',
    icon: 'spam-filter',
    link: 'https://docs.airstack.xyz/airstack-docs-and-faqs/guides/xmtp/spam-filters'
  },
  {
    name: 'EVM & Solana Resolvers',
    icon: 'resolvers',
    link: 'https://docs.airstack.xyz/airstack-docs-and-faqs/guides/solana'
  }
];

export function Abstractions() {
  return (
    <div className="card p-7 rounded-18 w-full">
      <h3 className="text-left font-bold mb-5 flex items-center">
        <Icon name="abstraction-modules" />
        <span className="ml-1.5">Abstraction Modules</span>
      </h3>
      <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3.5">
        {modules.map(({ name, icon, link }) => (
          <li
            key={name}
            className="card-light h-12 py-3 px-2.5 rounded-xl w-auto sm:w-64"
          >
            <a href={link} className="flex items-center font-semibold text-sm">
              <Icon name={icon} />
              <span className="ml-1.5 ellipsis">{name}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
