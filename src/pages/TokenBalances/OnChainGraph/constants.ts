export const maxScore = 10;
export const QUERY_LIMIT = 200;
export const MAX_ITEMS = 2000;
export const SCORE_KEY = 'airstack-score';

export const defaultScoreMap = {
  tokenSent: 10,
  tokenReceived: 0,
  followedByOnLens: 5,
  followingOnLens: 7,
  followedByOnFarcaster: 5,
  followingOnFarcaster: 5,
  commonPoaps: 7,
  commonEthNfts: 5,
  commonPolygonNfts: 1
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
  }
];
