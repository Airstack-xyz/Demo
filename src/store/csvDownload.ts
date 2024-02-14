import { createStore } from 'react-nano-store';
import { CSVDownloadOption } from '../types';

const store: {
  options: CSVDownloadOption[];
} = {
  options: []
};

export const useCsvDownloadOptions = createStore(store);
