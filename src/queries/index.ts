export const query = `query GetNFTOwnedByUser($owner: Identity, $limit: Int) {
  ethereum: TokenBalances(
    input: {filter: {owner: {_eq: $owner}, tokenType: {_in: [ERC1155, ERC721]}}, blockchain: ethereum, limit: $limit}
  ) {
    TokenBalance {
      amount
      tokenType
      blockchain
      tokenAddress
      tokenNfts {
        tokenId
        contentValue {
          image {
            small
          }
        }
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
  polygon: TokenBalances(
    input: {filter: {owner: {_eq: $owner}, tokenType: {_in: [ERC1155, ERC721]}}, blockchain: polygon, limit: $limit}
  ) {
    TokenBalance {
      amount
      tokenType
      blockchain
      tokenAddress
      tokenNfts {
        tokenId
        contentValue {
          image {
            small
          }
        }
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

export const POAPQuery = `query GetPOAPs($owner: Identity) {
  Poaps(input: {filter: {owner: {_eq: $owner}}, blockchain: ALL}) {
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

export const SocialQuery = `query Social($identity: Identity!, $blockchain: TokenBlockchain!) {
  Wallet(input: {identity: $identity, blockchain: $blockchain}) {
    primaryDomain {
      name
    }
    domains {
      name
    }
    socials {
      dappName
      profileName
    }
  }
}`;

export const MentionsQuery = `
  query SearchAIMentions($input: SearchAIMentionsInput!) {
    SearchAIMentions(input: $input) {
      type
      name
      address
      eventId
      blockchain
      thumbnailURL
    }
  }
`;

export const ERC20TokensQuery = `query ERC20TokensQuery($owner: Identity, $limit: Int) {
  ethereum: TokenBalances(
    input: {filter: {owner: {_eq: $owner}, tokenType: {_eq: ERC20}}, blockchain: ethereum, limit: $limit}
  ) {
    TokenBalance {
      tokenAddress
      formattedAmount
      blockchain
      id
      token {
        symbol
        name
      }
    }
  }
  polygon: TokenBalances(
    input: {filter: {owner: {_eq: $owner}, tokenType: {_eq: ERC20}}, blockchain: polygon, limit: $limit}
  ) {
    TokenBalance {
      tokenAddress
      formattedAmount
      blockchain
      id
      token {
        symbol
        name
      }
    }
  }
}`;
