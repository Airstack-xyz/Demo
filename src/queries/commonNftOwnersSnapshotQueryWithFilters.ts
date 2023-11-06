import { SnapshotFilterType } from '../Components/Filters/SnapshotFilter';
import { TokenAddress } from '../pages/TokenHolders/types';

const socialInput = '(input: {filter: {dappName: {_in: $socialFilters}}})';
const primaryDomainInput =
  '(input: {filter: {isPrimary: {_eq: $hasPrimaryDomain}}})';

function getCommonNftOwnersSubQueryForBlockchain({
  address1,
  address2,
  blockchain,
  appliedSnapshotFilter,
  hasSocialFilters,
  hasPrimaryDomain
}: {
  address1: TokenAddress;
  address2: TokenAddress;
  blockchain: string;
  appliedSnapshotFilter: SnapshotFilterType;
  hasSocialFilters: boolean;
  hasPrimaryDomain: boolean;
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
    ${blockchain}: Snapshots(input :{filter: {${filtersString}}, blockchain: ${blockchain}, limit: $limit}) {
        TokenBalance: Snapshot {
          owner {
            tokenBalances(input: {filter: {tokenAddress: {_eq:"${
              address2.address
            }"}}, blockchain: ${address2.blockchain}}) {
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
                domains${hasPrimaryDomain ? primaryDomainInput : ''} {
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

export function getCommonNftOwnersSnapshotQueryWithFilters({
  address1,
  address2,
  appliedSnapshotFilter,
  hasSocialFilters = false,
  hasPrimaryDomain = false
}: {
  address1: TokenAddress;
  address2: TokenAddress;
  appliedSnapshotFilter: SnapshotFilterType;
  hasSocialFilters?: boolean;
  hasPrimaryDomain?: boolean;
}) {
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
  if (hasSocialFilters) {
    variables.push('$socialFilters: [SocialDappName!]');
  }
  if (hasPrimaryDomain) {
    variables.push('$hasPrimaryDomain: Boolean');
  }
  const variablesString = variables.join(',');

  const subQueriesString = ['ethereum', 'polygon', 'base']
    .map(blockchain =>
      getCommonNftOwnersSubQueryForBlockchain({
        blockchain,
        address1,
        address2,
        appliedSnapshotFilter,
        hasSocialFilters,
        hasPrimaryDomain
      })
    )
    .join('\n');

  return `query CommonNftOwners(${variablesString}) {
    ${subQueriesString}
  }`;
}

function getNftOwnersSubQueryForBlockchain({
  address,
  blockchain,
  appliedSnapshotFilter,
  hasSocialFilters,
  hasPrimaryDomain
}: {
  address: string;
  blockchain: string;
  appliedSnapshotFilter: SnapshotFilterType;
  hasSocialFilters?: boolean;
  hasPrimaryDomain?: boolean;
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
    ${blockchain}: Snapshots(input: {filter: {${filtersString}}, blockchain: ${blockchain}, limit: $limit}) {
      TokenBalance : Snapshot {
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
          domains${hasPrimaryDomain ? primaryDomainInput : ''} {
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

export function getNftOwnersSnapshotQueryWithFilters({
  address,
  appliedSnapshotFilter,
  hasSocialFilters = false,
  hasPrimaryDomain = false
}: {
  address: string;
  appliedSnapshotFilter: SnapshotFilterType;
  hasSocialFilters?: boolean;
  hasPrimaryDomain?: boolean;
}) {
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
  if (hasSocialFilters) {
    variables.push('$socialFilters: [SocialDappName!]');
  }
  if (hasPrimaryDomain) {
    variables.push('$hasPrimaryDomain: Boolean');
  }
  const variablesString = variables.join(',');

  const subQueriesString = ['ethereum', 'polygon', 'base']
    .map(blockchain =>
      getNftOwnersSubQueryForBlockchain({
        blockchain,
        address,
        appliedSnapshotFilter,
        hasSocialFilters,
        hasPrimaryDomain
      })
    )
    .join('\n');

  return `query NftOwners(${variablesString}) {
    ${subQueriesString}
  }`;
}
