export const commonNFTTokens = `query GetTokens($identity: Identity!, $identity2: Identity!) {
  ethereum: TokenBalances(
    input: {filter: {owner: {_eq: $identity}, tokenType: {_in: [ERC721]}}, blockchain: ethereum, limit: 200}
  ) {
    TokenBalance {
      tokenAddress
      token {
        tokenBalances(
          input: {filter: {owner: {_eq: $identity2}, tokenType: {_in: [ERC721]}}, blockchain: ethereum}
        ) {
          tokenAddress
        }
      }
    }
  }
  polygon: TokenBalances(
    input: {filter: {owner: {_eq: $identity}, tokenType: {_in: [ERC721]}}, blockchain: ethereum, limit: 200}
  ) {
    TokenBalance {
      tokenAddress
      token {
        tokenBalances(
          input: {filter: {owner: {_eq: $identity2}, tokenType: {_in: [ERC721]}}, blockchain: ethereum}
        ) {
          tokenAddress
        }
      }
    }
  }
}`;
