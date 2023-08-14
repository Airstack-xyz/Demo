const fields = `
        amount
        tokenType
        blockchain
        tokenAddress
        formattedAmount
        owner {
            addresses
        }
        tokenNfts {
            tokenId
            contentValue {
                image {
                small
                large
                extraSmall
                medium
                original
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

function getQueryWithFiter(
  owners: string[],
  index = 0,
  blockchain: string
): string {
  const children =
    owners.length - 1 === index
      ? fields
      : getQueryWithFiter(owners, index + 1, blockchain);
  return `token {
        tokenBalances(
          input: {filter: {owner: {_eq: "${owners[index]}"}, tokenType: {_in: $tokenType}}, blockchain: ${blockchain}, order: {lastUpdatedTimestamp: $sortBy}}
        ) {
            ${children}
          }
        }`;
}

export function getQueryForBlockchain(owners: string[], isEth: boolean) {
  const blockchain = isEth ? 'ethereum' : 'polygon';
  const childern =
    owners.length === 1 ? fields : getQueryWithFiter(owners, 1, blockchain);
  return `
    ${blockchain}: TokenBalances(
      input: {filter: {owner: {_eq: "${owners[0]}"}, tokenType: {_in: $tokenType}}, blockchain: ${blockchain}, limit: $limit, order: {lastUpdatedTimestamp: $sortBy}}
    ) {
      TokenBalance {
        ${childern}
      }
    }`;
}

export function createNftWithCommonOwnersQuery(
  owners: string[],
  blockchain: string | null
) {
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
