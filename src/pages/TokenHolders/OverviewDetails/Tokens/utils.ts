import { Poap, PoapsData, Token as TokenType, TokensData } from '../../types';
import { removeDuplicateOwners } from './filters';

export function getPoapList(
  tokensData: PoapsData,
  hasMultipleTokens = false
): [Poap[], number] {
  const poaps = tokensData?.Poaps?.Poap || [];
  if (!hasMultipleTokens) {
    return [removeDuplicateOwners(poaps) as Poap[], poaps.length];
  }
  const visitedSet = new Set();
  const poapsWithValues = poaps
    .filter(token => {
      const poaps = token.owner.poaps;

      if (!poaps || poaps.length === 0) return false;

      const poap = poaps[0];
      const address = Array.isArray(token.owner.addresses)
        ? poap.owner.addresses[0]
        : poap.owner.addresses;
      const duplicate = visitedSet.has(address);
      visitedSet.add(address);
      return !duplicate;
    })
    .map(token => {
      return {
        ...token.owner.poaps[0],
        _poapEvent: token.poapEvent,
        _eventId: token.eventId
      };
    });
  return [poapsWithValues, poaps.length];
}

export function getTokenList(
  tokensData: TokensData,
  hasMultipleTokens = false,
  hasSomePoap = false
): [TokenType[], number] {
  let tokenBalances: TokenType[] = [];

  if (hasSomePoap) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tokenBalances = tokensData?.Poaps?.Poap as any;
  } else {
    const ethTokenBalances: TokenType[] =
      tokensData.ethereum?.TokenBalance || [];
    const polygonTokenBalances: TokenType[] =
      tokensData.polygon?.TokenBalance || [];
    tokenBalances = [...ethTokenBalances, ...polygonTokenBalances];
  }

  const originalSize = tokenBalances.length;

  if (hasMultipleTokens) {
    tokenBalances = tokenBalances
      .filter(token => token.owner?.tokenBalances?.length)
      .map(token => token.owner?.tokenBalances[0]);
  }
  const tokens = removeDuplicateOwners(tokenBalances) as TokenType[];

  return [tokens, originalSize];
}
