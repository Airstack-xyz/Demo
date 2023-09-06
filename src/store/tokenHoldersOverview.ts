import { createStore } from 'react-nano-store';

export type TokenHolder = {
  name: string;
  tokenAddress: string;
  holdersCount: number;
  tokenType: string;
  blockchain: string;
};

const store: {
  tokens: TokenHolder[];
  isERC6551: boolean;
} = {
  tokens: [],
  isERC6551: false
};

export const useOverviewTokens = createStore(store);
