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
  recommendations: RecommendedUser[],
  scoreMap: ScoreMap = getDefaultScoreMap()
) {
  return recommendations.map(user => {
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

    return {
      ...user,
      poaps: uniquePoaps,
      nfts: uniqueNfts,
      _score: score
    };
  });
}

export function sortByScore(recommendations: RecommendedUser[]) {
  return recommendations.sort((a, b) => {
    return (b._score || 0) - (a._score || 0);
  });
}
