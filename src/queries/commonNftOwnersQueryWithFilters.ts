import { tokenBlockchains } from '../constants';
import { TokenAddress } from '../pages/TokenHolders/types';

const socialInput = '(input: {filter: {dappName: {_in: $socialFilters}}})';
const primaryDomainInput =
  '(input: {filter: {isPrimary: {_eq: $hasPrimaryDomain}}})';

const getCommonNftOwnersSubQueryWithFilters = ({
  blockchain,
  token1,
  token2,
  hasSocialFilters,
  hasPrimaryDomain
}: {
  blockchain: string;
  token1: TokenAddress;
  token2: TokenAddress;
  hasSocialFilters?: boolean;
  hasPrimaryDomain?: boolean;
}) => {
  return `${blockchain}: TokenBalances(
    input: {filter: {tokenAddress: {_eq: "${
      token1.address
    }"}}, blockchain: ${blockchain}, limit: $limit
  }) {
    TokenBalance {
      owner {
        tokenBalances(input: {filter: {tokenAddress: {_eq: "${
          token2.address
        }"}}, blockchain: ${token2.blockchain || 'ethereum'}}) {
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
            accounts {
              tokenId
              tokenAddress
            }
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
          }
        }
      }
    }
  }`;
};

export function getCommonNftOwnersQueryWithFilters({
  token1,
  token2,
  hasSocialFilters,
  hasPrimaryDomain
}: {
  token1: TokenAddress;
  token2: TokenAddress;
  hasSocialFilters?: boolean;
  hasPrimaryDomain?: boolean;
}) {
  const variables = ['$limit: Int'];
  if (hasSocialFilters) {
    variables.push('$socialFilters: [SocialDappName!]');
  }
  if (hasPrimaryDomain) {
    variables.push('$hasPrimaryDomain: Boolean');
  }
  const variablesString = variables.join(',');

  const subQueries: string[] = [];
  tokenBlockchains.forEach(_blockchain => {
    if (!token1.blockchain || token1.blockchain === _blockchain) {
      subQueries.push(
        getCommonNftOwnersSubQueryWithFilters({
          blockchain: _blockchain,
          token1,
          token2,
          hasSocialFilters,
          hasPrimaryDomain
        })
      );
    }
  });
  const subQueriesString = subQueries.join('\n');

  return `query CommonNftOwners(${variablesString}) {
    ${subQueriesString}
  }`;
}

const getNftOwnersSubQueryWithFilters = ({
  blockchain,
  token,
  hasSocialFilters,
  hasPrimaryDomain
}: {
  blockchain: string;
  token: TokenAddress;
  hasSocialFilters?: boolean;
  hasPrimaryDomain?: boolean;
}) => {
  return `${blockchain}: TokenBalances(
      input: {filter: {tokenAddress: {_eq: "${
        token.address
      }"}}, blockchain: ${blockchain}, limit: $limit}
    ) {
      TokenBalance {
        tokenId
        tokenAddress
        tokenType
        formattedAmount
        owner {
          identity
          addresses
          accounts {
            tokenId
            tokenAddress
          }
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
        }
      }
    }`;
};

export function getNftOwnersQueryWithFilters({
  token,
  hasSocialFilters,
  hasPrimaryDomain
}: {
  token: TokenAddress;
  hasSocialFilters?: boolean;
  hasPrimaryDomain?: boolean;
}) {
  const variables = ['$limit: Int'];
  if (hasSocialFilters) {
    variables.push('$socialFilters: [SocialDappName!]');
  }
  if (hasPrimaryDomain) {
    variables.push('$hasPrimaryDomain: Boolean');
  }
  const variablesString = variables.join(',');

  const subQueries: string[] = [];
  tokenBlockchains.forEach(_blockchain => {
    if (!token.blockchain || token.blockchain === _blockchain) {
      subQueries.push(
        getNftOwnersSubQueryWithFilters({
          blockchain: _blockchain,
          token,
          hasSocialFilters,
          hasPrimaryDomain
        })
      );
    }
  });
  const subQueriesString = subQueries.join('\n');

  return `query NftOwners(${variablesString}) {
    ${subQueriesString}
  }`;
}
