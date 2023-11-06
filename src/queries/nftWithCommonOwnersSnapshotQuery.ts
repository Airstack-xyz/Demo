import { SnapshotFilterType } from '../Components/Filters/SnapshotFilter';

const fields = `
  amount
  tokenType
  blockchain
  tokenAddress
  formattedAmount
  owner {
    addresses
  }
  tokenNfts: tokenNft {
    tokenId
    contentValue {
      image {
        medium
      }
    }
    erc6551Accounts {
      address {
        addresses
        tokenBalances {
          tokenAddress
          tokenId
          tokenNfts {
            contentValue {
              image {
                medium
              }
            }
          }
        }
      }
    }
  }
  token {
    name
    symbol
    logo {
      small
    }
    projectDetails {
      imageUrl
    }
  }
`;

function getSubQueryWithFilter(
  owners: string[],
  index = 0,
  blockchain: string
): string {
  const children =
    owners.length - 1 === index
      ? fields
      : getSubQueryWithFilter(owners, index + 1, blockchain);
  return `
    token {
      name
      symbol
      logo {
        small
      }
      projectDetails {
        imageUrl
      }
      tokenBalances(input: {filter: {owner: {_eq: "${owners[index]}"}, tokenType: {_in: $tokenType}}, blockchain: ${blockchain}}) {
        ${children}
      }
    }
  `;
}

const parentFields = `
  blockchain
  tokenAddress
  tokenType
  formattedAmount
  tokenNfts: tokenNft {
    tokenId
    contentValue {
      image {
        medium
      }
    }
    erc6551Accounts {
      address {
        addresses
        tokenBalances {
          tokenAddress
          tokenId
          tokenNfts {
            contentValue {
              image {
                medium
              }
            }
          }
        }
      }
    }
  }
  token {
    name
    symbol
    logo {
      small
    }
    projectDetails {
      imageUrl
    }
  }
`;

function getSubQueryForBlockchain({
  owners,
  appliedSnapshotFilter,
  blockchain
}: {
  owners: string[];
  appliedSnapshotFilter: SnapshotFilterType;
  blockchain: string;
}) {
  const children =
    owners.length === 1 ? fields : getSubQueryWithFilter(owners, 1, blockchain);

  const filters = [
    `owner: {_eq: "${owners[0]}"}`,
    `tokenType: {_in: $tokenType}`
  ];
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
        ${owners.length > 1 ? parentFields : ''}
        ${children}
      }
    }
  `;
}

export function getNftWithCommonOwnersSnapshotQuery({
  owners,
  blockchain,
  appliedSnapshotFilter
}: {
  owners: string[];
  blockchain: string | null;
  appliedSnapshotFilter: SnapshotFilterType;
}) {
  if (!owners.length) return '';

  const variables = ['$tokenType: [TokenType!]', '$limit: Int'];
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

  const subQueries: string[] = [];
  ['ethereum', 'polygon', 'base'].forEach(_blockchain => {
    if (!blockchain || blockchain === _blockchain) {
      subQueries.push(
        getSubQueryForBlockchain({
          owners,
          appliedSnapshotFilter,
          blockchain: _blockchain
        })
      );
    }
  });
  const subQueriesString = subQueries.join('\n');

  return `query GetTokens(${variablesString}) {
    ${subQueriesString}
  }`;
}
