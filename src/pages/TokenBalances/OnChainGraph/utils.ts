import { defaultScoreMap } from './constants';
import { RecommendedUser } from './types';

export function filterDuplicatedAndCalculateScore(
  recommendations: RecommendedUser[]
) {
  return recommendations.map(user => {
    let score = 0;
    if (user.follows?.followingOnLens) {
      score += defaultScoreMap.followingOnLens;
    }
    if (user.follows?.followedOnLens) {
      score += defaultScoreMap.followedByOnLens;
    }
    if (user.follows?.followingOnFarcaster) {
      score += defaultScoreMap.followingOnFarcaster;
    }
    if (user.follows?.followedOnFarcaster) {
      score += defaultScoreMap.followedByOnFarcaster;
    }
    if (user.tokenTransfers?.sent) {
      score += defaultScoreMap.tokenSent;
    }
    if (user.tokenTransfers?.received) {
      score += defaultScoreMap.tokenReceived;
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
        defaultScoreMap.commonEthNfts * ethNftCount +
        defaultScoreMap.commonPolygonNfts * polygonNftCount;
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
      score += defaultScoreMap.commonPoaps * user.poaps.length;
    }

    return {
      ...user,
      poaps: uniquePoaps,
      nfts: uniqueNfts,
      _score: score
    };
  });
}
