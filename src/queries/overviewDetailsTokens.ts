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
    tokenAddress
    tokenId
    blockchain
    tokenType
    tokenNfts {
      contentValue {
        video {
          original
        }
        image {
          small
        }
      }
    }
    token {
      name
      symbol
      logo {
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
    }`;
};

function getQueryWithFilter(
  tokens: string[],
  index = 0,
  hasSocialFilters: boolean,
  hasPrimaryDomainFilter: boolean
): string {
  const children =
    tokens.length - 1 === index
      ? createBaseQuery(hasSocialFilters, hasPrimaryDomainFilter)
      : getQueryWithFilter(
          tokens,
          index + 1,
          hasSocialFilters,
          hasPrimaryDomainFilter
        );
  return `owner {
        tokenBalances(
          input: {filter: {tokenAddress: {_eq: "${tokens[index]}"}}}
        ) {
          ${children}
          }
        }
        token {
          logo {
            small
          }
          projectDetails {
            imageUrl
          }
        }
        tokenNfts {
          contentValue {
            video {
              original
            }
            image {
              small
            }
          }
        }`;
}

export const getFilterableTokensQuery = (
  tokenAddress: string[],
  hasSocialFilters = false,
  hasPrimaryDomainFilter = false
) => {
  const children =
    tokenAddress.length === 1
      ? createBaseQuery(hasSocialFilters, hasPrimaryDomainFilter)
      : getQueryWithFilter(
          tokenAddress,
          1,
          hasSocialFilters,
          hasPrimaryDomainFilter
        );
  return `query GetTokenHolders($limit: Int${
    hasSocialFilters ? ', $socialFilters: [SocialDappName!]' : ''
  }${hasPrimaryDomainFilter ? ', $hasPrimaryDomain: Boolean' : ''}) {
    ethereum: TokenBalances(
      input: {filter: {tokenAddress: {_eq: "${
        tokenAddress[0]
      }"}}, blockchain: ethereum, limit: $limit}
    ) {
      TokenBalance {
        ${children}
      }
    }
    polygon: TokenBalances(
      input: {filter: {tokenAddress: {_eq: "${
        tokenAddress[0]
      }"}}, blockchain: polygon, limit: $limit}
    ) {
      TokenBalance {
        ${children}
      }
    }
  }`;
};
