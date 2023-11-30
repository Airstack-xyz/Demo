export const apiKey = process.env.API_KEY || '';

// Used for options in Blockchain filter
// Used in queries for generating sub-queries throughout the app
export const tokenBlockchains = ['ethereum', 'polygon'] as const;

// Used in queries for generating sub-queries for snapshots
export const snapshotBlockchains = ['ethereum', 'base'] as const;
