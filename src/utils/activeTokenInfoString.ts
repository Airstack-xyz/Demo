type Token = {
  tokenAddress: string;
  tokenId: string;
  blockchain: string;
  eventId?: string | null;
  walletAddress?: string;
};

export function getActiveTokenInfoString(
  tokenAddress: string,
  tokenId: string,
  blockchain: string,
  eventId?: string | null,
  walletAddress?: string
) {
  return `${tokenAddress}_${tokenId}_${blockchain}_${eventId || ''}_${
    walletAddress || ''
  }`;
}

export function addToActiveTokenInfo(token: Token, activeTokenInfo = '') {
  return `${
    activeTokenInfo ? `${activeTokenInfo} ` : ''
  }${getActiveTokenInfoString(
    token.tokenAddress,
    token.tokenId,
    token.blockchain,
    token.eventId,
    token.walletAddress
  )}`;
}

export function getActiveTokenInfo(info: string): Token {
  const tokens = getAllActiveTokenInfo(info);
  return tokens[tokens.length - 1];
}

export function getAllActiveTokenInfo(info: string): Token[] {
  const tokenStrings = info.split(' ');
  const tokens = tokenStrings.map(token => {
    const [tokenAddress, tokenId, blockchain, eventId, walletAddress] =
      token.split('_');
    return {
      eventId,
      tokenId,
      blockchain,
      tokenAddress,
      walletAddress
    };
  });
  return tokens;
}

export function getActiveTokensInfoFromArray(tokens: Token[]) {
  return tokens
    .map(token => {
      const { tokenAddress, tokenId, blockchain, eventId, walletAddress } =
        token;
      return getActiveTokenInfoString(
        tokenAddress,
        tokenId,
        blockchain,
        eventId,
        walletAddress
      );
    })
    .join(' ');
}
