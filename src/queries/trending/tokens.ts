export const trendingTokens = /* GraphQL */ `
  query GetTrendingTokens(
    $audience: Audience!
    $blockchain: TrendingBlockchain!
    $criteria: TrendingTokensCriteria!
    $timeFrame: TimeFrame!
    $transferType: TrendingTokensTransferType!
    $limit: Int
  ) {
    TrendingTokens(
      input: {
        timeFrame: $timeFrame
        audience: $audience
        blockchain: $blockchain
        criteria: $criteria
        transferType: $transferType
        limit: $limit
      }
    ) {
      TrendingToken {
        id
        address
        audience
        criteria
        blockchain
        chainId
        criteriaCount
        token {
          name
          type
          symbol
          logo {
            medium
          }
          tokenNfts(input: { limit: 10 }) {
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
