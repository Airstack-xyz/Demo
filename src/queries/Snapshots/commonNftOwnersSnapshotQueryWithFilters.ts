import { SnapshotFilterType } from '../../Components/Filters/SnapshotFilter';
import { snapshotBlockchains } from '../../constants';
import { TokenAddress } from '../../pages/TokenHolders/types';

const socialInput = '(input: {filter: {dappName: {_in: $socialFilters}}})';
const primaryDomainInput =
  '(input: {filter: {isPrimary: {_eq: $hasPrimaryDomain}}})';

function getCommonNftOwnersSubQueryForBlockchain({
  tokenAddress1,
  tokenAddress2,
  blockchain,
  snapshotFilter,
  hasSocialFilters,
  hasPrimaryDomain
}: {
  tokenAddress1: TokenAddress;
  tokenAddress2: TokenAddress;
  blockchain: string;
  snapshotFilter: SnapshotFilterType;
  hasSocialFilters?: boolean;
  hasPrimaryDomain?: boolean;
}) {
  const filters = [`tokenAddress: {_eq: "${tokenAddress1.address}"}`];
  switch (snapshotFilter) {
    case 'customDate':
      filters.push('date: {_eq: $customDate}');
      break;
    case 'blockNumber':
      filters.push('blockNumber: {_eq: $blockNumber}');
      break;
    case 'timestamp':
      filters.push('timestamp: {_eq: $timestamp}');
      break;
  }
  const filtersString = filters.join(',');

  return `
    ${blockchain}: Snapshots(input :{filter: {${filtersString}}, blockchain: ${blockchain}, limit: $limit}) {
        TokenBalance: Snapshot {
          owner {
            tokenBalances(input: {filter: {tokenAddress: {_eq:"${
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
      }
    `;
}

export function getCommonNftOwnersSnapshotQueryWithFilters({
  tokenAddress1,
  tokenAddress2,
  snapshotFilter,
  hasSocialFilters,
  hasPrimaryDomain
}: {
  tokenAddress1: TokenAddress;
  tokenAddress2: TokenAddress;
  snapshotFilter: SnapshotFilterType;
  hasSocialFilters?: boolean;
  hasPrimaryDomain?: boolean;
}) {
  const variables = ['$limit: Int'];
  switch (snapshotFilter) {
    case 'customDate':
      variables.push('$customDate: String!');
      break;
    case 'blockNumber':
      variables.push('$blockNumber: Int!');
      break;
    case 'timestamp':
      variables.push('$timestamp: Int!');
      break;
  }
  if (hasSocialFilters) {
    variables.push('$socialFilters: [SocialDappName!]');
  }
  if (hasPrimaryDomain) {
    variables.push('$hasPrimaryDomain: Boolean');
  }
  const variablesString = variables.join(',');

  const subQueries: string[] = [];
  snapshotBlockchains.forEach(_blockchain => {
    if (!tokenAddress1.blockchain || tokenAddress1.blockchain === _blockchain) {
      subQueries.push(
        getCommonNftOwnersSubQueryForBlockchain({
          blockchain: _blockchain,
          tokenAddress1,
          tokenAddress2,
          snapshotFilter,
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

function getNftOwnersSubQueryForBlockchain({
  tokenAddress,
  blockchain,
  snapshotFilter,
  hasSocialFilters,
  hasPrimaryDomain
}: {
  tokenAddress: TokenAddress;
  blockchain: string;
  snapshotFilter: SnapshotFilterType;
  hasSocialFilters?: boolean;
  hasPrimaryDomain?: boolean;
}) {
  const filters = [`tokenAddress: {_eq: "${tokenAddress.address}"}`];
  switch (snapshotFilter) {
    case 'customDate':
      filters.push('date: {_eq: $customDate}');
      break;
    case 'blockNumber':
      filters.push('blockNumber: {_eq: $blockNumber}');
      break;
    case 'timestamp':
      filters.push('timestamp: {_eq: $timestamp}');
      break;
  }
  const filtersString = filters.join(',');

  return `
    ${blockchain}: Snapshots(input: {filter: {${filtersString}}, blockchain: ${blockchain}, limit: $limit}) {
      TokenBalance : Snapshot {
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
    }
  `;
}

export function getNftOwnersSnapshotQueryWithFilters({
  tokenAddress,
  snapshotFilter,
  hasSocialFilters,
  hasPrimaryDomain
}: {
  tokenAddress: TokenAddress;
  snapshotFilter: SnapshotFilterType;
  hasSocialFilters?: boolean;
  hasPrimaryDomain?: boolean;
}) {
  const variables = ['$limit: Int'];
  switch (snapshotFilter) {
    case 'customDate':
      variables.push('$customDate: String!');
      break;
    case 'blockNumber':
      variables.push('$blockNumber: Int!');
      break;
    case 'timestamp':
      variables.push('$timestamp: Int!');
      break;
  }
  if (hasSocialFilters) {
    variables.push('$socialFilters: [SocialDappName!]');
  }
  if (hasPrimaryDomain) {
    variables.push('$hasPrimaryDomain: Boolean');
  }
  const variablesString = variables.join(',');

  const subQueries: string[] = [];
  snapshotBlockchains.forEach(_blockchain => {
    if (!tokenAddress.blockchain || tokenAddress.blockchain === _blockchain) {
      subQueries.push(
        getNftOwnersSubQueryForBlockchain({
          blockchain: _blockchain,
          tokenAddress,
          snapshotFilter,
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
