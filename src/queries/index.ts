export const TokensQuery = `query GetTokens($owner: Identity, $tokenType: [TokenType!], $limit: Int) {
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
            medium
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

export const TokenOwnerQuery = `query GetTokenHolders($tokenAddress: Address, $limit: Int) {
  ethereum: TokenBalances(
    input: {filter: {tokenAddress: {_eq: $tokenAddress}}, blockchain: ethereum, limit: $limit}
  ) {
    TokenBalance {
      tokenAddress
      tokenId
      blockchain
      tokenType
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
        socials {
          blockchain
          dappSlug
          profileName
        }
        primaryDomain {
          name
        }
        domains {
          chainId
          dappName
          name
        }
      }
    }
    pageInfo {
      nextCursor
      prevCursor
    }
  }
  polygon: TokenBalances(
    input: {filter: {tokenAddress: {_eq: $tokenAddress}}, blockchain: polygon, limit: $limit}
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
        socials {
          blockchain
          dappSlug
          profileName
        }
        primaryDomain {
          name
        }
        domains {
          chainId
          dappName
          name
        }
      }
    }
    pageInfo {
      nextCursor
      prevCursor
    }
  }
}`;

export const PoapOwnerQuery = `query GetPoapOwners($eventId: [String!], $limit: Int) {
  Poaps(input: {filter: {eventId: {_in: $eventId}}, blockchain: ALL, limit: $limit}) {
    Poap {
      id
      blockchain
      tokenId
      tokenAddress
      eventId
      poapEvent {
        contentValue {
          image {
            original
            medium
            large
            extraSmall
            small
          }
          video
          audio
        }
        logo: contentValue {
          image {
            small
            medium
          }
        }
        blockchain
        eventName
      }
      owner {
        identity
        addresses
        socials {
          blockchain
          dappSlug
          profileName
        }
        primaryDomain {
          name
        }
        domains {
          chainId
          dappName
          name
        }
      }
    }
    pageInfo {
      nextCursor
      prevCursor
    }
  }
}`;

export const TokenTotalSupplyQuery = `query TotalSupply($tokenAddress: Address!) {
  ethereum: Token(input: {address: $tokenAddress, blockchain: ethereum}) {
    totalSupply
  }
  polygon: Token(input: {address: $tokenAddress, blockchain: polygon}) {
    totalSupply
  }
}`;
