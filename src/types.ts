import { tokenBlockchains } from './constants';

// Used for blockchain type based on actual tokenBlockchains
export type TokenBlockchain = (typeof tokenBlockchains)[number];
