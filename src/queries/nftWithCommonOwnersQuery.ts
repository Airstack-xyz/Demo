import { tokenBlockchains } from '../constants';

const fields = `
amount
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
`;

function getQueryWithFilter({
  owners,
  blockchain,
  index = 0
}: {
  owners: string[];
  blockchain: string;
  index?: number;
}): string {
  const children =
    owners.length - 1 === index
      ? fields
      : getQueryWithFilter({ owners, blockchain, index: index + 1 });

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

const parentFields = `
blockchain
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
}`;

function getQueryForBlockchain({
  owners,
  blockchain
}: {
  owners: string[];
  blockchain: string;
}) {
  const children =
    owners.length === 1
      ? fields
      : getQueryWithFilter({ owners, index: 1, blockchain });

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
        ${owners.length > 1 ? parentFields : ''}
        ${children}
      }
    }`;
}

export function getNftWithCommonOwnersQuery({
  owners,
  blockchain
}: {
  owners: string[];
  blockchain: string | null;
}) {
  if (!owners.length) return '';

  const subQueries: string[] = [];
  tokenBlockchains.forEach(_blockchain => {
    if (!blockchain || blockchain === _blockchain) {
      subQueries.push(
        getQueryForBlockchain({
          owners,
          blockchain: _blockchain
        })
      );
    }
  });
  const subQueriesString = subQueries.join('\n');

  return `query GetTokens($tokenType: [TokenType!], $limit: Int, $sortBy: OrderBy) {
    ${subQueriesString}
  }`;
}
