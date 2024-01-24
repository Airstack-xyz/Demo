export const MAX_SCORE = 100;
export const QUERY_LIMIT = 100;
export const MAX_ITEMS = 2000;
export const SCORE_KEY = 'airstack-score-v2';

export const nftsToIgnore = [
  // ENS
  '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
  // NameWrapper
  '0xd4416b13d2b3a9abae7acd5d6c2bbdbe25686401',
  // OpenSea Shared Storefront
  '0x495f947276749ce646f68ac8c248420045cb7b5e'
];

export const defaultScoreMap = {
  tokenSent: 50,
  tokenReceived: 5,
  followedByOnLens: 20,
  followingOnLens: 50,
  followedByOnFarcaster: 20,
  followingOnFarcaster: 50,
  commonPoaps: 5,
  commonEthNfts: 10,
  commonPolygonNfts: 0,
  commonBaseNfts: 15,
  commonZoraNfts: 15
};

export type ScoreMap = typeof defaultScoreMap;

export const scoreOptions: {
  label: string;
  value: keyof ScoreMap;
}[] = [
  {
    label: 'Sent tokens',
    value: 'tokenSent'
  },
  {
    label: 'Received tokens',
    value: 'tokenReceived'
  },
  {
    label: 'Followed by them on Lens',
    value: 'followedByOnLens'
  },
  {
    label: 'Following them on Lens',
    value: 'followingOnLens'
  },
  {
    label: 'Followed by them on Farcaster',
    value: 'followedByOnFarcaster'
  },
  {
    label: 'Following them on Farcaster',
    value: 'followingOnFarcaster'
  },
  {
    label: 'POAPs in common (each)',
    value: 'commonPoaps'
  },
  {
    label: 'Eth NFTs in common (each)',
    value: 'commonEthNfts'
  },
  {
    label: 'Pol. NFTs in common (each)',
    value: 'commonPolygonNfts'
  },
  {
    label: 'Base NFTs in common (each)',
    value: 'commonBaseNfts'
  },
  {
    label: 'Zora NFTs in common (each)',
    value: 'commonZoraNfts'
  }
];

export const getAPIDropdownOptions = [
  {
    label: 'Onchain Graph Guide',
    link: 'https://docs.airstack.xyz/airstack-docs-and-faqs/guides/onchain-graph'
  }
];
