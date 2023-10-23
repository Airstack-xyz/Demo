import {
  FetchPaginatedQueryReturnType,
  FetchQuery
} from '@airstack/airstack-react/types';
import { SCORE_KEY, ScoreMap, defaultScoreMap } from './constants';
import { RecommendedUser } from './types';

export function getDefaultScoreMap(): ScoreMap {
  const savedScoreMap = localStorage.getItem(SCORE_KEY);
  const savedScore: null | ScoreMap = savedScoreMap
    ? JSON.parse(savedScoreMap)
    : null;
  return savedScore || defaultScoreMap;
}

export function filterDuplicatedAndCalculateScore(
  _recommendations: RecommendedUser[],
  scoreMap: ScoreMap = getDefaultScoreMap(),
  identities: string[]
) {
  const identityMap = identities.reduce(
    (acc: Record<string, boolean>, identity) => {
      acc[identity] = true;
      return acc;
    },
    {}
  );
  const recommendations: RecommendedUser[] = [];
  _recommendations.forEach(user => {
    if (user.addresses?.some(address => identityMap[address])) {
      return null;
    }
    if (user.domains?.some(({ name }) => identityMap[name])) {
      return null;
    }
    let score = 0;
    if (user.follows?.followingOnLens) {
      score += scoreMap.followingOnLens;
    }
    if (user.follows?.followedOnLens) {
      score += scoreMap.followedByOnLens;
    }
    if (user.follows?.followingOnFarcaster) {
      score += scoreMap.followingOnFarcaster;
    }
    if (user.follows?.followedOnFarcaster) {
      score += scoreMap.followedByOnFarcaster;
    }
    if (user.tokenTransfers?.sent) {
      score += scoreMap.tokenSent;
    }
    if (user.tokenTransfers?.received) {
      score += scoreMap.tokenReceived;
    }
    let uniqueNfts: RecommendedUser['nfts'] = [];
    if (user.nfts) {
      const existingNFT: Record<string, boolean> = {};
      uniqueNfts = user.nfts.filter(nft => {
        const key = `${nft.address}-${nft.tokenNfts?.tokenId}`;
        if (existingNFT[key]) {
          return false;
        }
        existingNFT[key] = true;
        return true;
      });

      const ethNftCount = uniqueNfts.filter(
        nft => nft.blockchain === 'ethereum'
      ).length;
      const polygonNftCount = uniqueNfts.filter(
        nft => nft.blockchain === 'polygon'
      ).length;
      score +=
        scoreMap.commonEthNfts * ethNftCount +
        scoreMap.commonPolygonNfts * polygonNftCount;
    }
    let uniquePoaps: RecommendedUser['poaps'] = [];
    if (user.poaps) {
      const existingPoaps: Record<string, boolean> = {};
      uniquePoaps = user.poaps.filter(poaps => {
        if (poaps?.eventId && existingPoaps[poaps?.eventId]) {
          return false;
        }
        if (poaps?.eventId) {
          existingPoaps[poaps?.eventId] = true;
        }
        return true;
      });
      score += scoreMap.commonPoaps * user.poaps.length;
    }

    recommendations.push({
      ...user,
      poaps: uniquePoaps,
      nfts: uniqueNfts,
      _score: score
    });
  });
  return recommendations;
}

export function sortByScore(recommendations: RecommendedUser[]) {
  return recommendations.sort((a, b) => {
    return (b._score || 0) - (a._score || 0);
  });
}

export async function paginateRequest<D>(
  request: FetchPaginatedQueryReturnType<D>,
  onReceivedData: (data: D | null) => Promise<boolean>
) {
  let _hasNextPage = false;
  let _getNextPage = (() => {
    // empty function
  }) as FetchQuery<D>['getNextPage'];

  const { data, hasNextPage, getNextPage } = await request;

  _hasNextPage = hasNextPage;
  _getNextPage = getNextPage;

  if (!data) {
    return;
  }

  let shouldFetchMore = await onReceivedData(data);

  while (_hasNextPage && shouldFetchMore) {
    const res: null | FetchQuery<D> = await _getNextPage();
    if (!res) {
      break;
    }
    const { data, hasNextPage, getNextPage } = res;
    shouldFetchMore = await onReceivedData(data);
    _hasNextPage = hasNextPage;
    _getNextPage = getNextPage;
  }
}
