export const tokenDetailsQuery = `query TokenDetails($tokenAddress: Address!, $tokenId: String!, $blockchain: TokenBlockchain!) {
  nft: TokenNft(
    input: {address: $tokenAddress, tokenId: $tokenId, blockchain: $blockchain}
  ) {
    totalSupply 
    tokenURI
    tokenId
    address
    type
    lastTransferHash
    lastTransferBlock
    lastTransferTimestamp
    contentValue {
      image {
        medium
      }
    }
    metaData {
      description
      attributes {
        trait_type
        value
      }
    }
    erc6551Accounts {
      standard
    }
    token {
      name
      symbol
      owner {
        identity
      } 
    }
  }
  transfers: TokenTransfers(
    input: {filter: {tokenAddress: {_eq: $tokenAddress}}, blockchain: $blockchain, limit: 1, order: {blockTimestamp: ASC}}
  ) {
    TokenTransfer {
      blockTimestamp
      blockNumber
      transactionHash
      tokenAddress
      tokenId
    }
  }
}`;

export const erc6551TokensQuery = `query MyQuery($tokenAddress: Address, $tokenId: String, $blockchain: TokenBlockchain!) {
  Accounts(
    input: {blockchain: $blockchain, filter: {tokenAddress: {_eq: $tokenAddress}, tokenId: {_eq: $tokenId}}}
  ) {
    Account {
      standard
      address {
        addresses
        blockchain
        identity
        tokenBalances {
          tokenType
          blockchain
          tokenAddress
          tokenId
          blockchain
          token {
            name
            symbol
          }
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
}`;

export const poapDetailsQuery = `query PoapDetails($eventId: [String!], $tokenAddress: Address!) {
  poap: Poaps(
    input: {filter: {eventId: {_in: $eventId}}, blockchain: ALL, limit: 1}
  ) {
    Poap {
      id
      blockchain
      tokenId
      tokenAddress
      eventId
      tokenUri
      poapEvent {
        city
        contentValue {
          image {
            medium
          }
          video
          audio
        }
        logo: contentValue {
          image {
            small
            medium
          }
        }
        eventName
        startDate
        endDate
        endDate
        metadata
        tokenMints
      }
    }
  }
  tokenTransfer: TokenTransfers(
    input: {filter: {tokenAddress: {_eq: $tokenAddress}}, blockchain: ethereum, limit: 1, order: {blockTimestamp: ASC}}
  ) {
    TokenTransfer {
      blockTimestamp
      blockNumber
      transactionHash
      tokenAddress
      tokenId
    }
  }
}`;