export const query = `query GetNFTsOwnedByUser($owner: Identity, $limit: Int, $cursor: String) {
  TokenBalances(
    input: {filter: {owner: {_eq: $owner}, tokenType: {_in: [ERC1155, ERC721]}}, blockchain: ethereum, limit: $limit, cursor: $cursor}
  ) {
    TokenBalance {
      amount
      tokenType
      tokenAddress
      tokenNfts {
        tokenId
      }
      token {
        name
        symbol
      }
    } 
    pageInfo {
      nextCursor
      prevCursor
    }
  }
}`;

export const POAPQuery = `query GetPOAPs($owner: Identity, $tokenAddress: Address, $blockchain: TokenBlockchain!, $limit: Int) {
  TokenBalances(
    input: {filter: {owner: {_eq: $owner}, tokenType: {_in: [ERC1155, ERC721]}, tokenAddress: {_eq: $tokenAddress}}, blockchain: $blockchain, limit: $limit}
  ) {
    TokenBalance {
      tokenNfts {
        metaData {
          name
          image
        }
        lastTransferTimestamp
      }
    }
  }
}`;
