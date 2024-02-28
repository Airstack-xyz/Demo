import { createStore } from 'react-nano-store';

export type TokenHolder = {
  name: string;
  tokenAddress: string;
  holdersCount: number;
  tokenType: string;
  blockchain: string;
  image?: string;
};

const store: {
  tokens: TokenHolder[];
} = {
  tokens: []
};

export const useOverviewTokens = createStore(store);
