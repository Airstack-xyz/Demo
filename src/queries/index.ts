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

export const POAPQuery = `query GetPOAPs($owner: Identity, $cursor: String) {
  Poaps(input: {filter: {owner: {_eq: $owner}}, blockchain: ALL, cursor: $cursor}) {
    Poap {
      poapEvent {
        eventName
        startDate
        isVirtualEvent
        eventId
        logo: contentValue {
          image {
            small
          }
        }
      }
    }
    pageInfo {
      nextCursor
      prevCursor
    }
  }
}`;
