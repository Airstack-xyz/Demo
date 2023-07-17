export const tokensQuery = `query GetUserOwnedTokens($owner: Identity, $tokenType: [TokenType!], $limit: Int) {
  ethereum: TokenBalances(
    input: {filter: {owner: {_eq: $owner}, tokenType: {_in: $tokenType}}, blockchain: ethereum, limit: $limit}
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
            large
            extraSmall
            medium
            original
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
    input: {filter: {owner: {_eq: $owner}, tokenType: {_in: $tokenType}}, blockchain: polygon, limit: $limit}
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
            large
            extraSmall
            medium
            original
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

export const POAPQuery = `query GetPOAPs($owner: Identity, $limit: Int) {
  Poaps(input: {filter: {owner: {_eq: $owner}}, blockchain: ALL, limit: $limit}) {
    Poap {
      id
      blockchain
      tokenId
      tokenAddress
      poapEvent {
        city
        eventName
        startDate
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
      amount
      tokenType
      blockchain
      tokenAddress
      formattedAmount
      token {
        name
        symbol
        logo {
          small
        }
      }
    }
    pageInfo {
      nextCursor
      prevCursor
    }
  }
  polygon: TokenBalances(
    input: {filter: {owner: {_eq: $owner}, tokenType: {_eq: ERC20}}, blockchain: polygon, limit: $limit}
  ) {
    TokenBalance {
      amount
      tokenType
      blockchain
      tokenAddress
      formattedAmount
      token {
        name
        symbol
        logo {
          small
        }
      }
    }
    pageInfo {
      nextCursor
      prevCursor
    }
  }
}`;

export const tokenOwnerQuery = `query MyQuery($tokenAddress: Address, $limit: Int) {
  ethereum: TokenBalances(
    input: {filter: {tokenAddress: {_eq: $tokenAddress}}, blockchain: ethereum, limit: $limit}
  ) {
    TokenBalance {
      tokenAddress
      tokenId
      blockchain
      token {
        name
      }
      tokenNfts {
        contentValue {
          video
          image {
            small
            original
            medium
            large
            extraSmall
          }
        }
      }
      owner {
        identity
        addresses
        domains {
          chainId
          dappName
          name
        }
        socials {
          blockchain
          dappSlug
          profileName
        }
      }
    }
    pageInfo {
      nextCursor
      prevCursor
    }
  }
  polygon: TokenBalances(
    input: {filter: {tokenAddress: {_eq: $tokenAddress}}, blockchain: ethereum, limit: $limit}
  ) {
    TokenBalance {
      tokenAddress
      tokenId
      blockchain
      token {
        name
      }
      tokenNfts {
        contentValue {
          video
          image {
            small
            original
            medium
            large
            extraSmall
          }
        }
      }
      owner {
        identity
        addresses
        domains {
          chainId
          dappName
          name
        }
        socials {
          blockchain
          dappSlug
          profileName
        }
      }
    }
    pageInfo {
      nextCursor
      prevCursor
    }
  }
}`;
