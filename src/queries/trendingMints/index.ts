export const trendingMintsQuery = /* GraphQL */ `
  query GetTrendingMints(
    $audience: Audience!
    $blockchain: TrendingBlockchain!
    $criteria: TrendingMintsCriteria!
    $timeFrame: TimeFrame!
    $limit: Int
  ) {
    TrendingMints(
      input: {
        timeFrame: $timeFrame
        audience: $audience
        blockchain: $blockchain
        criteria: $criteria
        limit: $limit
      }
    ) {
      TrendingMint {
        id
        address
        audience
        criteria
        blockchain
        chainId
        erc1155TokenID
        criteriaCount
        token {
          name
          type
          symbol
          tokenNfts(input: { limit: 5 }) {
            type
            tokenId
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
`;