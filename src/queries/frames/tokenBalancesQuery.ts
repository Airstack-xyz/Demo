const walletSubQuery = `Wallet(input: {identity: $owner, blockchain: ethereum}) {
  identity
  primaryDomain {
    name
  }
  domains(input: {filter: {isPrimary: {_eq: false}}, limit: 1}) {
    name
  }
  farcasterSocials: socials(
    input: {filter: {dappName: {_eq: farcaster}}, limit: 1}
  ) {
    profileName
  }
  lensSocials: socials(input: {filter: {dappName: {_eq: farcaster}}, limit: 1}) {
    profileName
  }
}`;

export const GetTokensQuery = `query GetTokens($owner: Identity!, $tokenType: [TokenType!], $blockchain: TokenBlockchain!, $limit: Int) {
    TokenBalances(
      input: {filter: {owner: {_eq: $owner}, tokenType: {_in: $tokenType}}, blockchain: $blockchain, limit: $limit, order: {lastUpdatedTimestamp: DESC}}
    ) {
      TokenBalance {
        amount
        formattedAmount
        blockchain
        tokenType
        tokenId
        tokenAddress
        tokenNfts {
          tokenId
          contentValue {
            image {
              small
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
      }
    }
    ${walletSubQuery}
  }`;

export const GetPOAPsQuery = `query GetPOAPs($owner: Identity!, $limit: Int) {
  Poaps(
    input: {filter: {owner: {_eq: $owner}}, limit: $limit, blockchain: ALL, order: {createdAtBlockNumber: DESC}}
  ) {
    Poap {
      id
      blockchain
      tokenId
      tokenAddress
      poapEvent {
        city
        eventName
        startDate
        eventId
        contentValue {
          image {
            small
          }
        }
      }
    }
  }
  ${walletSubQuery}
}`;
