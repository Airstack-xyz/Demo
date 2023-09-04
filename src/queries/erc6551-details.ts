export const erc6551DetailsQuery = `query ERC6551Details($tokenAddress: Address!, $tokenId: String!, $blockchain: TokenBlockchain!) {
  nft: TokenNft(
    input: {address: $tokenAddress, tokenId: $tokenId, blockchain: $blockchain}
  ) {
    totalSupply
    metaData {
      description
      attributes {
        trait_type
        value
      }
    }
    lastTransferTimestamp
    lastTransferBlock
    lastTransferHash
    tokenURI
    tokenId
    address
    tokenBalances {
      tokenType
    }
    token {
      name
      symbol
      owner {
        identity
      }
      tokenNfts {
        tokenId
        contentValue {
          image {
            medium
          }
        }
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

export const getERC6551OfTokens = `query MyQuery($tokenAddress: Address, $tokenId: String, $blockchain: TokenBlockchain!) {
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
