import { Poap, Token } from '../../types';

type TokenOrPoap = Token | Poap;

export function filterByEns(tokens: TokenOrPoap[]) {
  return tokens?.filter(token => token?.owner?.domains?.length > 0);
}

export function filterByPrimaryEns(tokens: TokenOrPoap[]) {
  return tokens?.filter(token => token?.owner?.primaryDomain);
}

export function filterByLens(tokens: TokenOrPoap[]) {
  return tokens?.filter(token => {
    return token?.owner?.socials?.find(({ dappSlug }) =>
      dappSlug.includes('lens')
    );
  });
}

export function filterByFarcaster(tokens: TokenOrPoap[]) {
  return tokens?.filter(token => {
    return token?.owner?.socials?.find(({ dappSlug }) =>
      dappSlug.includes('farcaster')
    );
  });
}

export function filterByXmtp(tokens: TokenOrPoap[]) {
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

export type RequestFilters = {
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
