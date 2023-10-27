import { RecommendedUser } from './types';
export type OnchainGraphCache = {
  data: null | RecommendedUser[];
  hasCompleteData: boolean;
  totalScannedDocuments: number;
};

const cache: OnchainGraphCache = {
  data: null,
  hasCompleteData: true,
  totalScannedDocuments: 0
};

export function getCache() {
  return {
    ...cache
  };
}

export function setCache(
  data: null | RecommendedUser[],
  hasCompleteData: boolean,
  totalScannedDocuments: number
) {
  cache.data = data;
  cache.hasCompleteData = hasCompleteData;
  cache.totalScannedDocuments = totalScannedDocuments;
}

export function clearCache() {
  cache.data = null;
  cache.hasCompleteData = true;
  cache.totalScannedDocuments = 0;
}
