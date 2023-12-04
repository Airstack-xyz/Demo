export const apiKey = process.env.API_KEY || '';

// Used for options in Blockchain filter
// Used in queries for generating sub-queries throughout the app
export const tokenBlockchains = ['ethereum', 'base', 'polygon'] as const;

// Used in queries for generating sub-queries for snapshots
export const snapshotBlockchains = ['base'] as const;

// Used for options in Blockchain filter in @mentions for Advanced Search
export const mentionBlockchains = ['ethereum', 'polygon', 'gnosis'] as const;
