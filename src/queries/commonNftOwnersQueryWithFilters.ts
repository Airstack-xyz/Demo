import { TokenAddress } from '../pages/TokenHolders/types';

const socialInput = '(input: {filter: {dappName: {_in: $socialFilters}}})';
const primaryDomainInput =
  '(input: {filter: {isPrimary: {_eq: $hasPrimaryDomain}}})';

const getCommonNftOwnersSubQueryWithFilters = (
  blockchain: string,
  token1: TokenAddress,
  token2: TokenAddress,
  hasSocialFilters = false,
  hasPrimaryDomainFilter = false
) => {
  return `${blockchain}: TokenBalances(
    input: {filter: {tokenAddress: {_eq: "${
      token1.address
    }"}}, blockchain: ${blockchain}, limit: $limit
  }) {
    TokenBalance {
      owner {
        tokenBalances(input: {filter: {tokenAddress: {_eq: "${
          token2.address
        }"}}, blockchain: ${token2.blockchain}}) {
          tokenId
          tokenAddress
          tokenType
          formattedAmount
          token {
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
              dappName
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
      }
    }
  }`;
};

export function getCommonNftOwnersQueryWithFilters(
  token1: TokenAddress,
  token2: TokenAddress,
  hasSocialFilters = false,
  hasPrimaryDomainFilter = false
) {
  const variables = ['$limit: Int'];
  if (hasSocialFilters) {
    variables.push('$socialFilters: [SocialDappName!]');
  }
  if (hasPrimaryDomainFilter) {
    variables.push('$hasPrimaryDomain: Boolean');
  }
  const variablesString = variables.join(',');

  const subQueriesString = ['ethereum', 'polygon', 'base']
    .map(blockchain =>
      getCommonNftOwnersSubQueryWithFilters(
        blockchain,
        token1,
        token2,
        hasSocialFilters,
        hasPrimaryDomainFilter
      )
    )
    .join('\n');

  return `query CommonNftOwners(${variablesString}) {
    ${subQueriesString}
  }`;
}

const getNftOwnersSubQueryWithFilters = (
  blockchain: string,
  token: string,
  hasSocialFilters = false,
  hasPrimaryDomainFilter = false
) => {
  return `${blockchain}: TokenBalances(
      input: {filter: {tokenAddress: {_eq: "${token}"}}, blockchain: ${blockchain}, limit: $limit}
    ) {
      TokenBalance {
        tokenId
        tokenAddress
        tokenType
        formattedAmount
        owner {
          identity
          addresses
          socials${hasSocialFilters ? socialInput : ''} {
            blockchain
            dappSlug
            dappName
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
    }`;
};

export function getNftOwnersQueryWithFilters(
  token: string,
  hasSocialFilters = false,
  hasPrimaryDomainFilter = false
) {
  const variables = ['$limit: Int'];
  if (hasSocialFilters) {
    variables.push('$socialFilters: [SocialDappName!]');
  }
  if (hasPrimaryDomainFilter) {
    variables.push('$hasPrimaryDomain: Boolean');
  }
  const variablesString = variables.join(',');

  const subQueriesString = ['ethereum', 'polygon', 'base']
    .map(blockchain =>
      getNftOwnersSubQueryWithFilters(
        blockchain,
        token,
        hasSocialFilters,
        hasPrimaryDomainFilter
      )
    )
    .join('\n');

  return `query NftOwners(${variablesString}) {
    ${subQueriesString}
  }`;
}
