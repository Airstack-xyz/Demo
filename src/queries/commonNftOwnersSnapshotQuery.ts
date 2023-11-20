import { SnapshotFilterType } from '../Components/Filters/SnapshotFilter';
import { snapshotBlockchains } from '../constants';
import { TokenAddress } from '../pages/TokenHolders/types';

function getCommonNftOwnersSubQueryForBlockchain({
  address1,
  address2,
  blockchain,
  snapshotFilter
}: {
  address1: TokenAddress;
  address2: TokenAddress;
  blockchain: string;
  snapshotFilter: SnapshotFilterType;
}) {
  const filters = [`tokenAddress: {_eq: "${address1.address}"}`];
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
      TokenBalance: Snapshot {
        tokenId
        tokenAddress
        tokenType
        formattedAmount
        blockchain
        token {
          logo {
            small
          }
          projectDetails {
            imageUrl
          }
        }
        tokenNfts: tokenNft {
          contentValue {
            video
            image {
              small
              medium
            }
          }
          erc6551Accounts {
            address {
              identity
            }
          }
        }
        owner {
          tokenBalances(input: {filter :{tokenAddress: {_eq: "${
            address2.address
          }"}}, blockchain: ${address2.blockchain || 'ethereum'}}) {
            tokenId
            tokenAddress
            tokenType
            formattedAmount
            blockchain
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
                video
                image {
                  small
                  medium
                }
              }
              erc6551Accounts {
                address {
                  identity
                }
              }
            }
            owner {
              identity
              addresses
              socials {
                blockchain
                dappName
                profileName
                profileHandle
              }
              primaryDomain {
                name
              }
              domains {
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

export function getCommonNftOwnersSnapshotQuery({
  address1,
  address2,
  snapshotFilter
}: {
  address1: TokenAddress;
  address2: TokenAddress;
  snapshotFilter: SnapshotFilterType;
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
  const variablesString = variables.join(',');
  const subQueries: string[] = [];
  snapshotBlockchains.forEach(_blockchain => {
    if (!address1.blockchain || address1.blockchain === _blockchain) {
      subQueries.push(
        getCommonNftOwnersSubQueryForBlockchain({
          blockchain: _blockchain,
          address1,
          address2,
          snapshotFilter
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
  address,
  blockchain,
  snapshotFilter
}: {
  address: TokenAddress;
  blockchain: string;
  snapshotFilter: SnapshotFilterType;
}) {
  const filters = [`tokenAddress: {_eq: "${address.address}"}`];
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
    ${blockchain}: Snapshots(input: {filter :{${filtersString}}, blockchain: ${blockchain}, limit: $limit}) {
      TokenBalance: Snapshot {
        tokenId
        tokenAddress
        tokenType
        formattedAmount
        blockchain
        token {
          logo {
            small
          }
          projectDetails {
            imageUrl
          }
        }
        tokenNfts: tokenNft {
          contentValue {
            video
            image {
              small
              medium
            }
          }
          erc6551Accounts {
            address {
              identity
            }
          }
        }
        owner {
          identity
          addresses
          socials {
            blockchain
            dappName
            profileName
            profileHandle
          }
          primaryDomain {
            name
          }
          domains {
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

export function getNftOwnersSnapshotQuery({
  address,
  snapshotFilter
}: {
  address: TokenAddress;
  snapshotFilter: SnapshotFilterType;
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
  const variablesString = variables.join(',');

  const subQueries: string[] = [];
  snapshotBlockchains.forEach(_blockchain => {
    if (!address.blockchain || address.blockchain === _blockchain) {
      subQueries.push(
        getNftOwnersSubQueryForBlockchain({
          blockchain: _blockchain,
          address,
          snapshotFilter
        })
      );
    }
  });
  const subQueriesString = subQueries.join('\n');

  return `query NftOwners(${variablesString}) {
    ${subQueriesString}
  }`;
}
