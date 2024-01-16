import { SnapshotFilterType } from '../../Components/Filters/SnapshotFilter';
import { snapshotBlockchains } from '../../constants';
import { TokenAddress } from '../../pages/TokenHolders/types';

function getCommonNftOwnersSubQueryForBlockchain({
  token1,
  token2,
  blockchain,
  snapshotFilter
}: {
  token1: TokenAddress;
  token2: TokenAddress;
  blockchain: string;
  snapshotFilter: SnapshotFilterType;
}) {
  const filters = [`tokenAddress: {_eq: "${token1.address}"}`];
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
            token2.address
          }"}}, blockchain: ${token2.blockchain || 'ethereum'}}) {
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
  token1,
  token2,
  snapshotFilter
}: {
  token1: TokenAddress;
  token2: TokenAddress;
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
    if (!token1.blockchain || token1.blockchain === _blockchain) {
      subQueries.push(
        getCommonNftOwnersSubQueryForBlockchain({
          blockchain: _blockchain,
          token1,
          token2,
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
  token,
  blockchain,
  snapshotFilter
}: {
  token: TokenAddress;
  blockchain: string;
  snapshotFilter: SnapshotFilterType;
}) {
  const filters = [`tokenAddress: {_eq: "${token.address}"}`];
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
  token,
  snapshotFilter
}: {
  token: TokenAddress;
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
    if (!token.blockchain || token.blockchain === _blockchain) {
      subQueries.push(
        getNftOwnersSubQueryForBlockchain({
          blockchain: _blockchain,
          token,
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
