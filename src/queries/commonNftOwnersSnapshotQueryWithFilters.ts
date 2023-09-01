const socialInput = '(input:{ filter:{ dappName:{ _in: $socialFilters } } })';
const primaryDomainInput =
  '(input:{ filter:{ isPrimary:{ _eq: $hasPrimaryDomain } } })';

function getCommonNftOwnersSubqueryForBlockchain({
  address1,
  address2,
  blockchain,
  hasDate,
  hasBlockNumber,
  hasTimestamp,
  hasSocialFilters,
  hasPrimaryDomain
}: {
  address1: string;
  address2: string;
  blockchain: string;
  hasDate?: boolean;
  hasBlockNumber?: boolean;
  hasTimestamp?: boolean;
  hasSocialFilters: boolean;
  hasPrimaryDomain: boolean;
}) {
  const _filters = [`tokenAddress:{ _eq: "${address1}" }`];
  if (hasDate) {
    _filters.push('date:{ _eq: $date }');
  }
  if (hasBlockNumber) {
    _filters.push('blockNumber:{ _eq: $blockNumber }');
  }
  if (hasTimestamp) {
    _filters.push('timestamp:{ _eq: $timestamp }');
  }
  const _filtersString = _filters.join(',');

  return `
    ${blockchain}: Snapshots(input:{ filter:{ ${_filtersString} }, blockchain: ${blockchain}, limit: $limit}) {
        TokenBalance: Snapshot {
          owner {
            tokenBalances(input:{ filter:{ tokenAddress:{ _eq: "${address2}" } } }) {
              tokenId
              tokenAddress
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
  address1: string;
  address2: string;
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

  const _variables = ['$limit: Int'];
  if (commonParams.hasDate) {
    _variables.push('$date: String!');
  }
  if (commonParams.hasBlockNumber) {
    _variables.push('$blockNumber: Int!');
  }
  if (commonParams.hasTimestamp) {
    _variables.push('$timestamp: Int!');
  }
  if (commonParams.hasSocialFilters) {
    _variables.push('$socialFilters: [SocialDappName!]');
  }
  if (commonParams.hasPrimaryDomain) {
    _variables.push('$hasPrimaryDomain: Boolean');
  }
  const _variablesString = _variables.join(',');

  return `query CommonNftOwners(${_variablesString}) {
    ${getCommonNftOwnersSubqueryForBlockchain({
      blockchain: 'ethereum',
      ...commonParams
    })}
    ${getCommonNftOwnersSubqueryForBlockchain({
      blockchain: 'polygon',
      ...commonParams
    })}
  }`;
}

function getNftOwnersSubqueryForBlockchain({
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
  const _filters = [`tokenAddress:{ _eq: "${address}" }`];
  if (hasDate) {
    _filters.push('date:{ _eq: $date }');
  }
  if (hasBlockNumber) {
    _filters.push('blockNumber:{ _eq: $blockNumber }');
  }
  if (hasTimestamp) {
    _filters.push('timestamp:{ _eq: $timestamp }');
  }
  const _filtersString = _filters.join(',');

  return `
    ${blockchain}: Snapshots(input:{ filter:{ ${_filtersString} }, blockchain: ${blockchain}, limit: $limit}) {
      TokenBalance : Snapshot {
        tokenId
        tokenAddress
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

  const _variables = ['$limit: Int'];
  if (commonParams.hasDate) {
    _variables.push('$date: String!');
  }
  if (commonParams.hasBlockNumber) {
    _variables.push('$blockNumber: Int!');
  }
  if (commonParams.hasTimestamp) {
    _variables.push('$timestamp: Int!');
  }
  if (commonParams.hasSocialFilters) {
    _variables.push('$socialFilters: [SocialDappName!]');
  }
  if (commonParams.hasPrimaryDomain) {
    _variables.push('$hasPrimaryDomain: Boolean');
  }
  const _variablesString = _variables.join(',');

  return `query NftOwners(${_variablesString}) {
    ${getNftOwnersSubqueryForBlockchain({
      blockchain: 'ethereum',
      ...commonParams
    })}
    ${getNftOwnersSubqueryForBlockchain({
      blockchain: 'polygon',
      ...commonParams
    })}
  }`;
}
