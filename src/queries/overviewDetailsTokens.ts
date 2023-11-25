import { tokenBlockchains } from '../constants';

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

const getFields = (
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
        dappName
        profileName
        profileHandle
      }
      primaryDomain {
        name
      }
      domains${hasPrimaryDomainFilter ? primaryDomainInput : ''} {
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
      ? getFields(hasSocialFilters, hasPrimaryDomainFilter)
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
      ? getFields(hasSocialFilters, hasPrimaryDomainFilter)
      : getQueryWithFilter(
          tokenAddress,
          1,
          hasSocialFilters,
          hasPrimaryDomainFilter
        );

  const variables = ['$limit: Int'];
  if (hasSocialFilters) {
    variables.push('$socialFilters: [SocialDappName!]');
  }
  if (hasPrimaryDomainFilter) {
    variables.push('$hasPrimaryDomain: Boolean');
  }
  const variablesString = variables.join(',');

  const subQueries: string[] = [];
  tokenBlockchains.forEach(blockchain => {
    subQueries.push(`${blockchain}: TokenBalances(
        input: {filter: {tokenAddress: {_eq: "${tokenAddress[0]}"}}, blockchain: ${blockchain}, limit: $limit}
      ) {
        TokenBalance {
          ${children}
        }
      }`);
  });
  const subQueriesString = subQueries.join('\n');

  return `query GetTokenHolders(${variablesString}) {
    ${subQueriesString}
  }`;
};
