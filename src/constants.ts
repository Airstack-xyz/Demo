export const apiKey = process.env.API_KEY || '';

// Used for options in Blockchain filter
// Used in queries for generating sub-queries for token-balances
export const tokenBlockchains = ['ethereum', 'polygon', 'base'] as const;

// Used in queries for generating sub-queries for snapshots
export const snapshotBlockchains = ['base'] as const;
