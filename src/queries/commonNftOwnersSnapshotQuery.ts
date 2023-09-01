function getCommonNftOwnersSubqueryForBlockchain({
  address1,
  address2,
  blockchain,
  hasDate,
  hasBlockNumber,
  hasTimestamp
}: {
  address1: string;
  address2: string;
  blockchain: string;
  hasDate?: boolean;
  hasBlockNumber?: boolean;
  hasTimestamp?: boolean;
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
    ${blockchain}: Snapshots(input:{ filter:{ ${_filtersString} }, blockchain: ${blockchain}, limit: $limit }) {
      TokenBalance: Snapshot {
        tokenId
        tokenAddress
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
            }
          }
        }
        owner {
          tokenBalances(input:{ filter:{ tokenAddress:{ _eq: "${address2}" } } }) {
            tokenId
            tokenAddress
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
                }
              }
            }
            owner {
              identity
              addresses
              socials {
                blockchain
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
  date,
  blockNumber,
  timestamp
}: {
  address1: string;
  address2: string;
  date?: string;
  blockNumber?: number;
  timestamp?: number;
}) {
  const commonParams = {
    address1,
    address2,
    hasDate: !!date,
    hasBlockNumber: !!blockNumber,
    hasTimestamp: !!timestamp
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
  hasTimestamp
}: {
  address: string;
  blockchain: string;
  hasDate?: boolean;
  hasBlockNumber?: boolean;
  hasTimestamp?: boolean;
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
    ${blockchain}: Snapshots(input:{ filter:{ ${_filtersString} }, blockchain: ${blockchain}, limit: $limit }) {
      TokenBalance: Snapshot {
        tokenId
        tokenAddress
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
            }
          }
        }
        owner {
          identity
          addresses
          socials {
            blockchain
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
  date,
  blockNumber,
  timestamp
}: {
  address: string;
  date?: string;
  blockNumber?: number;
  timestamp?: number;
}) {
  const commonParams = {
    address,
    hasDate: !!date,
    hasBlockNumber: !!blockNumber,
    hasTimestamp: !!timestamp
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
