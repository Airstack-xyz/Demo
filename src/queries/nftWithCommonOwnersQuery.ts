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

function getQueryWithFilter(
  owners: string[],
  index = 0,
  blockchain: string
): string {
  const children =
    owners.length - 1 === index
      ? fields
      : getQueryWithFilter(owners, index + 1, blockchain);
  return `token {
        name
        symbol
        logo {
          small
        }
        projectDetails {
          imageUrl
        }
        tokenBalances(
          input: {filter: {owner: {_eq: "${owners[index]}"}, tokenType: {_in: $tokenType}}, blockchain: ${blockchain}, order: {lastUpdatedTimestamp: $sortBy}}
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
  name
  symbol
  logo {
    small
  }
  projectDetails {
    imageUrl
  }
}`;

export function getQueryForBlockchain(owners: string[], blockchain: string) {
  const children =
    owners.length === 1 ? fields : getQueryWithFilter(owners, 1, blockchain);
  return `
    ${blockchain}: TokenBalances(
      input: {filter: {owner: {_eq: "${
        owners[0]
      }"}, tokenType: {_in: $tokenType}}, blockchain: ${blockchain}, limit: $limit, order: {lastUpdatedTimestamp: $sortBy}}
    ) {
      TokenBalance {
        ${owners.length > 1 ? parentFields : ''}
        ${children}
      }
    }`;
}

export function createNftWithCommonOwnersQuery(
  owners: string[],
  blockchain: string | null
) {
  if (!owners.length) return '';

  const subQueries: string[] = [];
  ['ethereum', 'polygon', 'base'].forEach(_blockchain => {
    if (!blockchain || blockchain === _blockchain) {
      subQueries.push(getQueryForBlockchain(owners, _blockchain));
    }
  });
  const subQueriesString = subQueries.join('\n');

  return `query GetTokens($tokenType: [TokenType!], $limit: Int, $sortBy: OrderBy) {
    ${subQueriesString}
  }`;
}
