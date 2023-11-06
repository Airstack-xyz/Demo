export const apiKey = process.env.API_KEY || '';

// Used in queries for generating sub-queries for token-balances and snapshots
export const tokenBlockchains = ['ethereum', 'polygon', 'base'] as const;
