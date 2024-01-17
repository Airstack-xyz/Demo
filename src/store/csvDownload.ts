import { createStore } from 'react-nano-store';

const store: {
  inProgressDownloads: number[];
} = {
  inProgressDownloads: []
};

export const useInProgressDownloads = createStore(store);
