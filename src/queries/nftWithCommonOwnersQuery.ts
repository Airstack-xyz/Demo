import { tokenBlockchains } from '../constants';

function getFields({
  owner,
  mintsOnly
}: {
  owner: string;
  mintsOnly?: boolean;
}) {
  const subQueries = [];
  if (mintsOnly) {
    const filters = [
      `from: {_eq: "0x0000000000000000000000000000000000000000"}`,
      `operator: {_eq: "${owner}"}`,
      `to: {_eq: "${owner}"}`
    ];
    const filtersString = filters.join(',');

    subQueries.push(`tokenTransfers(input: {filter: {${filtersString}}, order: {blockTimestamp: ASC}, limit: 1}) {
      type
    }`);
  }
  const subQueriesString = subQueries.join('\n');

  return `amount
  tokenType
  blockchain
  tokenAddress
  formattedAmount
  tokenId
  tokenAddress
  owner {
      addresses
  }
  tokenNfts {
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
    isSpam
    name
    symbol
    logo {
      small
    }
    projectDetails {
      imageUrl
    }
  }
  ${subQueriesString}
  `;
}

function getQueryWithFilter({
  owners,
  index = 0,
  blockchain,
  mintsOnly
}: {
  owners: string[];
  index?: number;
  blockchain: string;
  mintsOnly?: boolean;
}): string {
  const children =
    owners.length - 1 === index
      ? getFields({ owner: owners[index], mintsOnly })
      : getQueryWithFilter({ owners, index: index + 1, blockchain, mintsOnly });

  const filters = [
    `owner: {_eq: "${owners[index]}"}`,
    `tokenType: {_in: $tokenType}`
  ];
  const filtersString = filters.join(',');

  return `token {
        isSpam
        name
        symbol
        logo {
          small
        }
        projectDetails {
          imageUrl
        }
        tokenBalances(
          input: {filter: {${filtersString}}, blockchain: ${blockchain}, order: {lastUpdatedTimestamp: $sortBy}}
        ) {
          ${children}
        }
      }`;
}

function getParentFields({
  owner,
  mintsOnly
}: {
  owner: string;
  mintsOnly?: boolean;
}) {
  const subQueries = [];
  if (mintsOnly) {
    const filters = [
      `from: {_eq: "0x0000000000000000000000000000000000000000"}`,
      `operator: {_eq: "${owner}"}`,
      `to: {_eq: "${owner}"}`
    ];
    const filtersString = filters.join(',');

    subQueries.push(`tokenTransfers(input: {filter: {${filtersString}}, order: {blockTimestamp: ASC}, limit: 1}) {
      type
    }`);
  }
  const subQueriesString = subQueries.join('\n');

  return `blockchain
  tokenAddress
  tokenType
  tokenNfts {
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
    isSpam
    name
    symbol
    logo {
      small
    }
    projectDetails {
      imageUrl
    }
  }
  ${subQueriesString}
  `;
}

function getQueryForBlockchain({
  owners,
  blockchain,
  mintsOnly
}: {
  owners: string[];
  blockchain: string;
  mintsOnly?: boolean;
}) {
  const children =
    owners.length === 1
      ? getFields({ owner: owners[0], mintsOnly })
      : getQueryWithFilter({ owners, index: 1, blockchain, mintsOnly });

  const filters = [
    `owner: {_eq: "${owners[0]}"}`,
    `tokenType: {_in: $tokenType}`
  ];
  const filtersString = filters.join(',');

  return `
    ${blockchain}: TokenBalances(
      input: {filter: {${filtersString}}, blockchain: ${blockchain}, limit: $limit, order: {lastUpdatedTimestamp: $sortBy}}
    ) {
      TokenBalance {
        ${
          owners.length > 1
            ? getParentFields({ owner: owners[0], mintsOnly })
            : ''
        }
        ${children}
      }
    }`;
}

export function getNftWithCommonOwnersQuery({
  owners,
  blockchain,
  mintsOnly
}: {
  owners: string[];
  blockchain: string | null;
  mintsOnly?: boolean;
}) {
  if (!owners.length) return '';

  const subQueries: string[] = [];
  tokenBlockchains.forEach(_blockchain => {
    if (!blockchain || blockchain === _blockchain) {
      subQueries.push(
        getQueryForBlockchain({
          owners,
          blockchain: _blockchain,
          mintsOnly
        })
      );
    }
  });
  const subQueriesString = subQueries.join('\n');

  return `query GetTokens($tokenType: [TokenType!], $limit: Int, $sortBy: OrderBy) {
    ${subQueriesString}
  }`;
}
