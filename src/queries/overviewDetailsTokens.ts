import { tokenBlockchains } from '../constants';
import { TokenAddress } from '../page-views/TokenHolders/types';

const socialInput = '(input: {filter: {dappName: {_in: $socialFilters}}})';
const primaryDomainInput =
  '(input: {filter: {isPrimary: {_eq: $hasPrimaryDomain}}})';

const getFields = ({
  hasSocialFilters,
  hasPrimaryDomain
}: {
  hasSocialFilters?: boolean;
  hasPrimaryDomain?: boolean;
}) => {
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
      domains${hasPrimaryDomain ? primaryDomainInput : ''} {
        name
      }
      xmtp {
        isXMTPEnabled
      }
    }`;
};

function getQueryWithFilter({
  tokenAddresses,
  index = 0,
  hasSocialFilters,
  hasPrimaryDomain
}: {
  tokenAddresses: TokenAddress[];
  index?: number;
  hasSocialFilters?: boolean;
  hasPrimaryDomain?: boolean;
}): string {
  const children =
    tokenAddresses.length - 1 === index
      ? getFields({ hasSocialFilters, hasPrimaryDomain })
      : getQueryWithFilter({
          tokenAddresses,
          index: index + 1,
          hasSocialFilters,
          hasPrimaryDomain
        });
  return `owner {
        tokenBalances(
          input: {filter: {tokenAddress: {_eq: "${tokenAddresses[index]}"}}}
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

export const getFilterableTokensQuery = ({
  tokenAddresses,
  hasSocialFilters,
  hasPrimaryDomain
}: {
  tokenAddresses: TokenAddress[];
  hasSocialFilters?: boolean;
  hasPrimaryDomain?: boolean;
}) => {
  const children =
    tokenAddresses.length === 1
      ? getFields({ hasSocialFilters, hasPrimaryDomain })
      : getQueryWithFilter({
          tokenAddresses,
          index: 1,
          hasSocialFilters,
          hasPrimaryDomain
        });

  const variables = ['$limit: Int'];
  if (hasSocialFilters) {
    variables.push('$socialFilters: [SocialDappName!]');
  }
  if (hasPrimaryDomain) {
    variables.push('$hasPrimaryDomain: Boolean');
  }
  const variablesString = variables.join(',');

  const subQueries: string[] = [];
  tokenBlockchains.forEach(blockchain => {
    subQueries.push(`${blockchain}: TokenBalances(
        input: {filter: {tokenAddress: {_eq: "${tokenAddresses[0]}"}}, blockchain: ${blockchain}, limit: $limit}
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
