import { SnapshotFilterType } from '../Components/Filters/SnapshotFilter';
import { TokenAddress } from '../pages/TokenHolders/types';

function getCommonNftOwnersSubQueryForBlockchain({
  address1,
  address2,
  blockchain,
  appliedSnapshotFilter
}: {
  address1: TokenAddress;
  address2: TokenAddress;
  blockchain: string;
  appliedSnapshotFilter: SnapshotFilterType;
}) {
  const filters = [`tokenAddress: {_eq: "${address1.address}"}`];
  switch (appliedSnapshotFilter) {
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
          tokenBalances(input: {filter :{tokenAddress: {_eq: "${address2.address}"}}, blockchain: ${address2.blockchain}}) {
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
                dappSlug
                profileName
              }
              primaryDomain {
                name
              }
              domains {
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
    }
  `;
}

export function getCommonNftOwnersSnapshotQuery({
  address1,
  address2,
  appliedSnapshotFilter
}: {
  address1: TokenAddress;
  address2: TokenAddress;
  appliedSnapshotFilter: SnapshotFilterType;
}) {
  const commonParams = {
    address1,
    address2,
    appliedSnapshotFilter
  };

  const variables = ['$limit: Int'];
  switch (appliedSnapshotFilter) {
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

  return `query CommonNftOwners(${variablesString}) {
    ${getCommonNftOwnersSubQueryForBlockchain({
      blockchain: 'ethereum',
      ...commonParams
    })}
    ${getCommonNftOwnersSubQueryForBlockchain({
      blockchain: 'polygon',
      ...commonParams
    })}
  }`;
}

function getNftOwnersSubQueryForBlockchain({
  address,
  blockchain,
  appliedSnapshotFilter
}: {
  address: string;
  blockchain: string;
  appliedSnapshotFilter: SnapshotFilterType;
}) {
  const filters = [`tokenAddress: {_eq: "${address}"}`];
  switch (appliedSnapshotFilter) {
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
            dappSlug
            profileName
          }
          primaryDomain {
            name
          }
          domains {
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
  `;
}

export function getNftOwnersSnapshotQuery({
  address,
  appliedSnapshotFilter
}: {
  address: string;
  appliedSnapshotFilter: SnapshotFilterType;
}) {
  const commonParams = {
    address,
    appliedSnapshotFilter
  };

  const variables = ['$limit: Int'];
  switch (appliedSnapshotFilter) {
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

  return `query NftOwners(${variablesString}) {
    ${getNftOwnersSubQueryForBlockchain({
      blockchain: 'ethereum',
      ...commonParams
    })}
    ${getNftOwnersSubQueryForBlockchain({
      blockchain: 'polygon',
      ...commonParams
    })}
  }`;
}
