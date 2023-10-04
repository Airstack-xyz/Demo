import { TokenAddress } from '../pages/TokenHolders/types';

const socialInput = '(input: {filter: {dappName: {_in: $socialFilters}}})';
const primaryDomainInput =
  '(input: {filter: {isPrimary: {_eq: $hasPrimaryDomain}}})';

function getCommonNftOwnersSubQueryForBlockchain({
  address1,
  address2,
  blockchain,
  hasDate,
  hasBlockNumber,
  hasTimestamp,
  hasSocialFilters,
  hasPrimaryDomain
}: {
  address1: TokenAddress;
  address2: TokenAddress;
  blockchain: string;
  hasDate?: boolean;
  hasBlockNumber?: boolean;
  hasTimestamp?: boolean;
  hasSocialFilters: boolean;
  hasPrimaryDomain: boolean;
}) {
  const filters = [`tokenAddress: {_eq: "${address1.address}"}`];
  if (hasDate) {
    filters.push('date: {_eq: $date}');
  }
  if (hasBlockNumber) {
    filters.push('blockNumber: {_eq: $blockNumber}');
  }
  if (hasTimestamp) {
    filters.push('timestamp: {_eq: $timestamp}');
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
  date,
  blockNumber,
  timestamp,
  hasSocialFilters = false,
  hasPrimaryDomain = false
}: {
  address1: TokenAddress;
  address2: TokenAddress;
  date?: string;
  blockNumber?: number;
  timestamp?: number;
  hasSocialFilters?: boolean;
  hasPrimaryDomain?: boolean;
}) {
  const commonParams = {
    address1,
    address2,
    hasDate: !!date,
    hasBlockNumber: !!blockNumber,
    hasTimestamp: !!timestamp,
    hasSocialFilters,
    hasPrimaryDomain
  };

  const variables = ['$limit: Int'];
  if (commonParams.hasDate) {
    variables.push('$date: String!');
  }
  if (commonParams.hasBlockNumber) {
    variables.push('$blockNumber: Int!');
  }
  if (commonParams.hasTimestamp) {
    variables.push('$timestamp: Int!');
  }
  if (commonParams.hasSocialFilters) {
    variables.push('$socialFilters: [SocialDappName!]');
  }
  if (commonParams.hasPrimaryDomain) {
    variables.push('$hasPrimaryDomain: Boolean');
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
  hasDate,
  hasBlockNumber,
  hasTimestamp,
  hasSocialFilters,
  hasPrimaryDomain
}: {
  address: string;
  blockchain: string;
  hasDate?: boolean;
  hasBlockNumber?: boolean;
  hasTimestamp?: boolean;
  hasSocialFilters?: boolean;
  hasPrimaryDomain?: boolean;
}) {
  const filters = [`tokenAddress: {_eq: "${address}"}`];
  if (hasDate) {
    filters.push('date: {_eq: $date}');
  }
  if (hasBlockNumber) {
    filters.push('blockNumber: {_eq: $blockNumber}');
  }
  if (hasTimestamp) {
    filters.push('timestamp: {_eq: $timestamp}');
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
  date,
  blockNumber,
  timestamp,
  hasSocialFilters = false,
  hasPrimaryDomain = false
}: {
  address: string;
  date?: string;
  blockNumber?: number;
  timestamp?: number;
  hasSocialFilters?: boolean;
  hasPrimaryDomain?: boolean;
}) {
  const commonParams = {
    address,
    hasDate: !!date,
    hasBlockNumber: !!blockNumber,
    hasTimestamp: !!timestamp,
    hasSocialFilters,
    hasPrimaryDomain
  };

  const variables = ['$limit: Int'];
  if (commonParams.hasDate) {
    variables.push('$date: String!');
  }
  if (commonParams.hasBlockNumber) {
    variables.push('$blockNumber: Int!');
  }
  if (commonParams.hasTimestamp) {
    variables.push('$timestamp: Int!');
  }
  if (commonParams.hasSocialFilters) {
    variables.push('$socialFilters: [SocialDappName!]');
  }
  if (commonParams.hasPrimaryDomain) {
    variables.push('$hasPrimaryDomain: Boolean');
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
