export const defaultScore = [
  {
    name: 'Sent tokens',
    key: 'tokenSent',
    score: 10
  },
  {
    name: 'Received tokens',
    key: 'tokenReceived',
    score: 0
  },
  {
    name: 'Followed by them on Lens',
    key: 'followedByOnLens',
    score: 5
  },
  {
    name: 'Following them on Lens',
    key: 'followingOnLens',
    score: 7
  },
  {
    name: 'Followed by them on Farcaster',
    key: 'followedByOnFarcaster',
    score: 5
  },
  {
    name: 'Following them on Farcaster',
    key: 'followingOnFarcaster',
    score: 5
  },
  {
    name: 'POAPs in common (each)',
    key: 'commonPoaps',
    score: 7
  },
  {
    name: 'Eth NFTs in common (each)',
    key: 'commonEthNfts',
    score: 5
  },
  {
    name: 'Pol. NFTs in common (each)',
    key: 'commonPolygonNfts',
    score: 1
  }
];

// export const defaultScoreMap = defaultScore.reduce(
//   (_map: Record<string, number>, { key, score }) => {
//     _map[key] = score;
//     return _map;
//   },
//   {}
// );

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
