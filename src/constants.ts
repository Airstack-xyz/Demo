export const apiKey = process.env.API_KEY || '';

// Used for options in Blockchain filter
// Used in queries for generating sub-queries throughout the app
export const tokenBlockchains = ['ethereum', 'base', 'polygon'] as const;

// Used in queries for generating sub-queries for snapshots
export const snapshotBlockchains = ['ethereum', 'base'] as const;

// Used for options in Blockchain filter in @mentions for Advanced Search
export const mentionBlockchains = [
  'ethereum',
  'base',
  'polygon',
  'gnosis'
] as const;

export const downCSVKeys = [
  'nft-holders',
  'erc20-holders',
  'poap-holders',
  'nft-holders-snapshot',
  'erc20-holders-snapshot',
  'common-nft-holders',
  'nft-erc20-holders',
  'erc20-poap-holders',
  'nft-balances',
  'erc20-balances',
  'poap-balances',
  'nft-balances-snapshot',
  'erc20-balances-snapshot',
  'socials',
  'farcaster-followers',
  'farcaster-erc20-followers',
  'farcaster-poap-followers',
  'farcaster-nft-followers',
  'farcaster-followings',
  'farcaster-erc20-followings',
  'farcaster-poap-followings',
  'farcaster-nft-followings',
  'lens-followers',
  'lens-erc20-followers',
  'lens-poap-followers',
  'lens-nft-followers',
  'lens-followings',
  'lens-erc20-followings',
  'lens-poap-followings',
  'lens-nft-followings'
] as const;
