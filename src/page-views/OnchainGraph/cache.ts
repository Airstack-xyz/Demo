import { RecommendedUser } from './types';
export type OnchainGraphCache = {
  data: null | RecommendedUser[];
  hasCompleteData: boolean;
  totalScannedDocuments: number;
  cacheFor: string;
};

const cache: OnchainGraphCache = {
  data: null,
  hasCompleteData: true,
  totalScannedDocuments: 0,
  cacheFor: ''
};

export function getCache() {
  return {
    ...cache
  };
}

export function setCache(newCache: OnchainGraphCache) {
  cache.cacheFor = newCache.cacheFor;
  cache.data = newCache.data;
  cache.hasCompleteData = newCache.hasCompleteData;
  cache.totalScannedDocuments = newCache.totalScannedDocuments;
}

export function clearCache() {
  cache.cacheFor = '';
  cache.data = null;
  cache.hasCompleteData = true;
  cache.totalScannedDocuments = 0;
}
