export const POAPSupplyQuery = `query PoapTotalSupply($eventId: String!) {
    PoapEvents(input: {filter: {eventId: {_eq: $eventId}}, blockchain: ALL}) {
      PoapEvent {
        tokenMints
      }
    }
  }`;

const socialInput = '(input: {filter: {dappName: {_in: $socialFilters}}})';
const primaryDomainInput =
  '(input: {filter: {isPrimary: {_eq: $hasPrimaryDomain}}})';

const createBaseQuery = (
  hasSocialFilters = false,
  hasPrimaryDomainFilter = false
) => {
  return `
  TokenBalance {
    tokenAddress
    tokenId
    blockchain
    tokenType
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
    token {
      name
      symbol
      logo {
        medium
        small
      }
      projectDetails {
        imageUrl
      }
    }
    owner {
      identity
      addresses
      socials${hasSocialFilters ? socialInput : ''} {
        blockchain
        dappSlug
        profileName
      }
      primaryDomain {
        name
      }
      domains${hasPrimaryDomainFilter ? primaryDomainInput : ''} {
        chainId
        dappName
        name
      }
      xmtp {
        isXMTPEnabled
      }
    }
  }
  pageInfo {
    nextCursor
    prevCursor
  }
`;
};

export const getFilterableTokensQuery = (
  hasSocialFilters = false,
  hasPrimaryDomainFilter = false
) => {
  return `query GetTokenHolders($tokenAddress: Address, $limit: Int${
    hasSocialFilters ? ', $socialFilters: [SocialDappName!]' : ''
  }${hasPrimaryDomainFilter ? ', $hasPrimaryDomain: Boolean' : ''}) {
    ethereum: TokenBalances(
      input: {filter: {tokenAddress: {_eq: $tokenAddress}}, blockchain: ethereum, limit: $limit}
    ) {
      ${createBaseQuery(hasSocialFilters, hasPrimaryDomainFilter)}
    }
    polygon: TokenBalances(
      input: {filter: {tokenAddress: {_eq: $tokenAddress}}, blockchain: polygon, limit: $limit}
    ) {
      ${createBaseQuery(hasSocialFilters, hasPrimaryDomainFilter)}
    }
  }`;
};

export const getFilterablePoapsQuery = (
  hasSocialFilters = false,
  hasPrimaryDomainFilter = false
) => {
  return `query GetPoapHolders($eventId: [String!], $limit: Int${
    hasSocialFilters ? ', $socialFilters: [SocialDappName!]' : ''
  }${hasPrimaryDomainFilter ? ', $hasPrimaryDomain: Boolean' : ''}) {
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
          socials${hasSocialFilters ? socialInput : ''} {
            blockchain
            dappSlug
            profileName
          }
          primaryDomain {
            name
          }
          domains${hasPrimaryDomainFilter ? primaryDomainInput : ''} {
            chainId
            dappName
            name
          }
          xmtp {
            isXMTPEnabled
          }
        }
      }
      pageInfo {
        nextCursor
        prevCursor
      }
    }
  }`;
};
