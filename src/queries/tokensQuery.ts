const createBaseQuery = () => {
  return `TokenBalance {
      amount
      tokenType
      blockchain
      tokenAddress
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
      }
    }`;
};

function getQueryForBlockchain(isEth: boolean) {
  if (isEth) {
    return `ethereum: TokenBalances(
    input: {filter: {owner: {_eq: $owner}, tokenType: {_in: $tokenType}}, blockchain: ethereum, limit: $limit, order: {lastUpdatedTimestamp: $sortBy}}
  ) {
    ${createBaseQuery()} 
    pageInfo {
      nextCursor
      prevCursor
    }
  }`;
  }

  return `polygon: TokenBalances(
    input: {filter: {owner: {_eq: $owner}, tokenType: {_in: $tokenType}}, blockchain: polygon, limit: $limit, order: {lastUpdatedTimestamp: $sortBy}}
  ) {
   ${createBaseQuery()} 
    pageInfo {
      nextCursor
      prevCursor
    }
  }`;
}

export function getTokensQuery(blockchain: string | null) {
  return `query GetTokens($owner: Identity, $tokenType: [TokenType!], $limit: Int, $sortBy: OrderBy) {
  ${!blockchain || blockchain === 'ethereum' ? getQueryForBlockchain(true) : ''}
  ${!blockchain || blockchain === 'polygon' ? getQueryForBlockchain(false) : ''}
}`;
}

export const MultiTokenOverviewQuery = `query TokenOverviewQuery($tokenAddress: [Address!]) {
  ethereum: TokenHolders(
    input: {filter: {inputType: {_eq: token}, tokenAddress: {_intersection: $tokenAddress}}, blockchain: ethereum}
  ) {
    ensUsersCount
    farcasterProfileCount
    lensProfileCount
    primaryEnsUsersCount
    totalHolders
    xmtpUsersCount
  }
  polygon: TokenHolders(
    input: {filter: {inputType: {_eq: token}, tokenAddress: {_intersection: $tokenAddress}}, blockchain: polygon}
  ) {
    ensUsersCount
    farcasterProfileCount
    lensProfileCount
    primaryEnsUsersCount
    totalHolders
    xmtpUsersCount
  }
}`;

export const MultiPoapsOverviewQuery = `query TokenOverviewQuery($eventId: [Address!]) {
  ethereum: TokenHolders(
    input: {filter: {inputType: {_eq: poap}, eventId: {_intersection: $eventId}}, blockchain: ethereum}
  ) {
    ensUsersCount
    farcasterProfileCount
    lensProfileCount
    primaryEnsUsersCount
    totalHolders
    xmtpUsersCount
  }
}`;
