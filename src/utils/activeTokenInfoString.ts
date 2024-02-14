import { tokenBlockchains } from '../constants';

export function getActiveTokenInfoString(
  tokenAddress: string,
  tokenId: string,
  blockchain: string,
  eventId?: string | null
) {
  return `${tokenAddress}_${tokenId}_${blockchain}_${eventId || ''}`;
}

export function addToActiveTokenInfo(
  token: {
    tokenAddress: string;
    tokenId: string;
    blockchain: string;
    eventId?: string | null;
  },
  activeTokenInfo = ''
) {
  return `${
    activeTokenInfo ? `${activeTokenInfo} ` : ''
  }${getActiveTokenInfoString(
    token.tokenAddress,
    token.tokenId,
    token.blockchain,
    token.eventId
  )}`;
}

export function getActiveTokenInfo(info: string) {
  const tokens = getAllActiveTokenInfo(info);
  return tokens[tokens.length - 1];
}

export function getAllActiveTokenInfo(info: string) {
  const tokenStrings = info.split(' ');
  const tokens = tokenStrings.map(token => {
    const [tokenAddress, tokenId, blockchain, eventId] = token.split('_');
    return {
      tokenAddress,
      tokenId,
      blockchain,
      eventId
    };
  });
  return tokens;
}

export type TokenInfo = ReturnType<typeof getActiveTokenInfo>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getActiveTokensInfoFromArray(tokens: any[]) {
  return tokens
    .map(token => {
      const { tokenAddress, tokenId, blockchain, eventId } = token;
      return getActiveTokenInfoString(
        tokenAddress,
        tokenId,
        blockchain,
        eventId
      );
    })
    .join(' ');
}

export const checkBlockchainSupportForToken = (chain?: string) => {
  return tokenBlockchains.findIndex(_chain => _chain === chain) !== -1;
};
