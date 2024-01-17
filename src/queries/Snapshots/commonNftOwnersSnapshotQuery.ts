import { SnapshotFilterType } from '../../Components/Filters/SnapshotFilter';
import { snapshotBlockchains } from '../../constants';
import { TokenAddress } from '../../pages/TokenHolders/types';

function getCommonNftOwnersSubQueryForBlockchain({
  tokenAddress1,
  tokenAddress2,
  blockchain,
  snapshotFilter
}: {
  tokenAddress1: TokenAddress;
  tokenAddress2: TokenAddress;
  blockchain: string;
  snapshotFilter: SnapshotFilterType;
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
            video {
              original
            }
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
            tokenAddress2.address
          }"}}, blockchain: ${tokenAddress2.blockchain || 'ethereum'}}) {
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
                video {
                  original
                }
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
  tokenAddress1,
  tokenAddress2,
  snapshotFilter
}: {
  tokenAddress1: TokenAddress;
  tokenAddress2: TokenAddress;
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
    if (!tokenAddress1.blockchain || tokenAddress1.blockchain === _blockchain) {
      subQueries.push(
        getCommonNftOwnersSubQueryForBlockchain({
          blockchain: _blockchain,
          tokenAddress1,
          tokenAddress2,
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
  tokenAddress,
  blockchain,
  snapshotFilter
}: {
  tokenAddress: TokenAddress;
  blockchain: string;
  snapshotFilter: SnapshotFilterType;
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
            video {
              original
            }
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
  tokenAddress,
  snapshotFilter
}: {
  tokenAddress: TokenAddress;
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
    if (!tokenAddress.blockchain || tokenAddress.blockchain === _blockchain) {
      subQueries.push(
        getNftOwnersSubQueryForBlockchain({
          blockchain: _blockchain,
          tokenAddress,
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
