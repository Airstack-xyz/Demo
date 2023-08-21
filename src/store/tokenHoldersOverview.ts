import { createStore } from 'react-nano-store';

export type TokenHolders = {
  name: string;
  tokenAddress: string;
  holdersCount: number;
  tokenType: string;
};

const store: {
  tokens: TokenHolders[];
} = {
  tokens: []
};

export const useOverviewTokens = createStore(store);
