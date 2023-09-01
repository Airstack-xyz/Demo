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

export function getOverviewQuery(
  hasPolygon: boolean,
  hasEvents: boolean,
  hasEthereum: boolean
) {
  return `query TokenHolders(${
    hasPolygon ? '$polygonTokens: [Address!], ' : ''
  }${hasEvents ? '$eventIds: [Address!], ' : ''}${
    hasEthereum ? '$ethereumTokens: [Address!]' : ''
  }) {
    TokenHolders(input: {filter: {polygonTokens: {${
      hasPolygon ? '_intersection: $polygonTokens' : ''
    }}, eventId: {${
    hasEvents ? '_intersection: $eventIds' : ''
  }}, ethereumTokens: {${
    hasEthereum ? '_intersection: $ethereumTokens' : ''
  }}}}) {
      farcasterProfileCount
      primaryEnsUsersCount
      totalHolders
      xmtpUsersCount
      lensProfileCount
      ensUsersCount
    }
  }`;
}
