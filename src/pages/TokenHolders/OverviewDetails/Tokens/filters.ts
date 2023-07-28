import { Poap, Token } from '../../types';

type TokenOrPoap = Token | Poap;

export function filterByEns(tokens: TokenOrPoap[]) {
  return tokens?.filter(token => token?.owner?.domains?.length > 0);
}

export function filterByPrimaryEns(tokens: TokenOrPoap[]) {
  return tokens?.filter(token => token?.owner?.domains?.length > 0);
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
