import { snapshotBlockchains, tokenBlockchains } from './constants';

// Used for blockchain type based on actual tokenBlockchains
export type TokenBlockchain = (typeof tokenBlockchains)[number];

// Used for blockchain type based on actual snapshotsBlockchains
export type SnapshotBlockchain = (typeof snapshotBlockchains)[number];
