/// <reference lib="webworker" />

import * as Comlink from 'comlink';
import { RecommendedUser } from '../types';
import { ScoreMap } from '../constants';

export function isBurnedAddress(address?: string) {
  if (!address) {
    return false;
  }
  address = address.toLowerCase();
  return (
    address === '0x0000000000000000000000000000000000000000' ||
    address === '0x000000000000000000000000000000000000dead'
  );
}

function filterAndRankData(
  _recommendations: RecommendedUser[],
  scoreMap: ScoreMap,
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
    if (
      user.addresses?.some(address => identityMap[address]) ||
      user.domains?.some(({ name }) => identityMap[name]) ||
      user.addresses?.some(address => isBurnedAddress(address))
    ) {
      return;
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
        if (existingNFT[key] || isBurnedAddress(nft.address)) {
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

function sortFilterAndRankData(
  recommendations: RecommendedUser[],
  scorceMap: ScoreMap,
  identities: string[]
) {
  return sortByScore(filterAndRankData(recommendations, scorceMap, identities));
}

Comlink.expose({ sortFilterAndRankData });
