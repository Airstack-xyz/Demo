import { snapshotBlockchains, tokenBlockchains } from '../../../../constants';
import { Poap, PoapsData, Token, TokensData } from '../../types';

type TokenOrPoap = Token | Poap;

export function removeDuplicateOwners(tokens: TokenOrPoap[]): TokenOrPoap[] {
  const visitedTokensSet = new Set();
  return tokens.filter(token => {
    const address =
      token?.owner?.identity ||
      (Array.isArray(token.owner.addresses)
        ? token.owner.addresses[0]
        : token.owner.addresses);
    const duplicate = visitedTokensSet.has(address);
    visitedTokensSet.add(address);
    return !duplicate;
  });
}

export function getPoapList({
  tokensData,
  hasMultipleTokens = false
}: {
  tokensData: PoapsData;
  hasMultipleTokens?: boolean;
}): [Poap[], number] {
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

export function getTokenList({
  tokensData,
  hasMultipleTokens = false,
  hasSomePoap = false,
  isSnapshotApplicable
}: {
  tokensData: TokensData;
  hasMultipleTokens?: boolean;
  hasSomePoap?: boolean;
  isSnapshotApplicable?: boolean;
}): [Token[], number] {
  let tokenBalances: Token[] = [];

  if (hasSomePoap) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tokenBalances = tokensData?.Poaps?.Poap as any;
  } else {
    const appropriateBlockchains = isSnapshotApplicable
      ? snapshotBlockchains
      : tokenBlockchains;

    appropriateBlockchains.forEach(blockchain => {
      const balances = tokensData?.[blockchain]?.TokenBalance || [];
      tokenBalances.push(...balances);
    });
  }

  const originalSize = tokenBalances.length;

  if (hasMultipleTokens) {
    tokenBalances = tokenBalances
      .filter(token => token.owner?.tokenBalances?.length)
      .map(token => token.owner?.tokenBalances[0]);
  }
  const tokens = removeDuplicateOwners(tokenBalances) as Token[];

  return [tokens, originalSize];
}

function filterByEns(tokens: TokenOrPoap[]) {
  return tokens?.filter(token => token?.owner?.domains?.length > 0);
}

function filterByPrimaryEns(tokens: TokenOrPoap[]) {
  return tokens?.filter(token => token?.owner?.primaryDomain);
}

function filterByLens(tokens: TokenOrPoap[]) {
  return tokens?.filter(token => {
    return token?.owner?.socials?.find(({ dappName }) => dappName === 'lens');
  });
}

function filterByFarcaster(tokens: TokenOrPoap[]) {
  return tokens?.filter(token => {
    return token?.owner?.socials?.find(
      ({ dappName }) => dappName === 'farcaster'
    );
  });
}

function filterByXmtp(tokens: TokenOrPoap[]) {
  return tokens?.filter(token => token?.owner?.xmtp?.length > 0);
}

export function filterTokens(filters: string[], tokens: TokenOrPoap[]) {
  filters.forEach(filter => {
    if (filter === 'farcaster') {
      tokens = filterByFarcaster(tokens);
    }
    if (filter === 'lens') {
      tokens = filterByLens(tokens);
    }
    if (filter === 'xmtp') {
      tokens = filterByXmtp(tokens);
    }
    if (filter === 'ens') {
      tokens = filterByEns(tokens);
    }
    if (filter === 'primaryEns') {
      tokens = filterByPrimaryEns(tokens);
    }
  });
  return tokens;
}

type RequestFilters = {
  socialFilters?: string[];
  hasPrimaryDomain?: boolean;
};

export function getRequestFilters(filters: string[]) {
  const requestFilters: RequestFilters = {
    socialFilters: []
  };

  filters.forEach(filter => {
    if (filter === 'farcaster' || filter === 'lens') {
      requestFilters['socialFilters']?.push(filter);
    }
    if (filter === 'primaryEns') {
      requestFilters['hasPrimaryDomain'] = true;
    }
  });

  if (requestFilters['socialFilters']?.length === 0) {
    delete requestFilters['socialFilters'];
  }

  return requestFilters;
}
