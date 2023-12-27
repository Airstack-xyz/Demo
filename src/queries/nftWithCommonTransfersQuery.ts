import { tokenBlockchains } from '../constants';

function getQueryForBlockchain({
  from,
  blockchain,
  mintsOnly
}: {
  from: string[];
  blockchain: string;
  mintsOnly?: boolean;
}) {
  const filters = [`tokenType: {_in: $tokenType}`];
  if (mintsOnly) {
    // mints are transfers executed by the same user and has null address as 'from'
    filters.push(
      `operator: {_in: ${JSON.stringify(from)}}`,
      `from: {_eq: "0x0000000000000000000000000000000000000000"}`,
      `to: {_in: ${JSON.stringify(from)}}`
    );
  } else {
    filters.push(`from: {_in: ${JSON.stringify(from)}}`);
  }

  const filtersString = filters.join(',');

  return `
    ${blockchain}: TokenTransfers(
      input: {filter: {${filtersString}}, blockchain: ${blockchain}, limit: $limit, order: {blockTimestamp: $sortBy}}
    ) {
      TokenBalance: TokenTransfer {
        blockchain
        tokenAddress
        tokenType
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
      }
    }`;
}

export function getNftWithCommonTransfersQuery({
  from,
  blockchain,
  mintsOnly
}: {
  from: string[];
  blockchain: string | null;
  mintsOnly?: boolean;
}) {
  if (!from.length) return '';

  const subQueries: string[] = [];
  tokenBlockchains.forEach(_blockchain => {
    if (!blockchain || blockchain === _blockchain) {
      subQueries.push(
        getQueryForBlockchain({
          from,
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
