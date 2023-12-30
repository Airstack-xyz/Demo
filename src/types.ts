import { snapshotBlockchains, tokenBlockchains } from './constants';

// Please don't update it since it is derived type
// Used for blockchain type based on actual tokenBlockchains
export type TokenBlockchain = (typeof tokenBlockchains)[number];

// Please don't update it since it is derived type
// Used for blockchain type based on actual snapshotsBlockchains
export type SnapshotBlockchain = (typeof snapshotBlockchains)[number];
