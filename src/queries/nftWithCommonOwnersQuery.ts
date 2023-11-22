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
          input: {filter: {owner: {_eq: "${owners[index]}"}, tokenType: {_in: $tokenType}}, blockchain: ${blockchain}, order: {lastUpdatedTimestamp: $sortBy}}
        ) {
            ${children}
          }
        }`;
}

export function getQueryForBlockchain(owners: string[], isEth: boolean) {
  const blockchain = isEth ? 'ethereum' : 'polygon';
  const children =
    owners.length === 1 ? fields : getQueryWithFilter(owners, 1, blockchain);
  return `
    ${blockchain}: TokenBalances(
      input: {filter: {owner: {_eq: "${owners[0]}"}, tokenType: {_in: $tokenType}}, blockchain: ${blockchain}, limit: $limit, order: {lastUpdatedTimestamp: $sortBy}}
    ) {
      TokenBalance {
        ${children}
      }
    }`;
}

export function createNftWithCommonOwnersQuery(
  owners: string[],
  blockchain: string | null
) {
  if (!owners.length) return '';
  return `query GetTokens($tokenType: [TokenType!], $limit: Int, $sortBy: OrderBy) {
    ${
      !blockchain || blockchain === 'ethereum'
        ? getQueryForBlockchain(owners, true)
        : ''
    }
    ${
      !blockchain || blockchain === 'polygon'
        ? getQueryForBlockchain(owners, false)
        : ''
    }
  }`;
}
