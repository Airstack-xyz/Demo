import { tokenBlockchains } from '../constants';
import { TokenAddress } from '../page-views/TokenHolders/types';

const socialInput = '(input: {filter: {dappName: {_in: $socialFilters}}})';
const primaryDomainInput =
  '(input: {filter: {isPrimary: {_eq: $hasPrimaryDomain}}})';

const getCommonNftOwnersSubQueryWithFilters = ({
  blockchain,
  tokenAddress1,
  tokenAddress2,
  hasSocialFilters,
  hasPrimaryDomain
}: {
  blockchain: string;
  tokenAddress1: TokenAddress;
  tokenAddress2: TokenAddress;
  hasSocialFilters?: boolean;
  hasPrimaryDomain?: boolean;
}) => {
  return `${blockchain}: TokenBalances(
    input: {filter: {tokenAddress: {_eq: "${
      tokenAddress1.address
    }"}}, blockchain: ${blockchain}, limit: $limit
  }) {
    TokenBalance {
      owner {
        tokenBalances(input: {filter: {tokenAddress: {_eq: "${
          tokenAddress2.address
        }"}}, blockchain: ${tokenAddress2.blockchain || 'ethereum'}}) {
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
            blockchain
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
  tokenAddress1,
  tokenAddress2,
  hasSocialFilters,
  hasPrimaryDomain
}: {
  tokenAddress1: TokenAddress;
  tokenAddress2: TokenAddress;
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
    if (!tokenAddress1.blockchain || tokenAddress1.blockchain === _blockchain) {
      subQueries.push(
        getCommonNftOwnersSubQueryWithFilters({
          blockchain: _blockchain,
          tokenAddress1,
          tokenAddress2,
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
  tokenAddress,
  hasSocialFilters,
  hasPrimaryDomain
}: {
  blockchain: string;
  tokenAddress: TokenAddress;
  hasSocialFilters?: boolean;
  hasPrimaryDomain?: boolean;
}) => {
  return `${blockchain}: TokenBalances(
      input: {filter: {tokenAddress: {_eq: "${
        tokenAddress.address
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
          blockchain
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
  tokenAddress,
  hasSocialFilters,
  hasPrimaryDomain
}: {
  tokenAddress: TokenAddress;
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
    if (!tokenAddress.blockchain || tokenAddress.blockchain === _blockchain) {
      subQueries.push(
        getNftOwnersSubQueryWithFilters({
          blockchain: _blockchain,
          tokenAddress,
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
