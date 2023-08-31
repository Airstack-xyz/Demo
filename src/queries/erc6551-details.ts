export const erc6551DetailsQuery = `query ERC6551Details($blockchain: TokenBlockchain!, $tokenAddress: Address, $tokenId: String) {
  Accounts(
    input: {blockchain: $blockchain, filter: {tokenAddress: {_eq: $tokenAddress}, tokenId: {_eq: $tokenId}}}
  ) {
    Account {
      nft {
        lastTransferTimestamp
        lastTransferBlock
        lastTransferHash
        tokenURI
        tokenId
        tokenBalances {
          tokenType
        }
        token {
          name
          symbol
          tokenTraits
          totalSupply
          owner {
            identity
          }
        }
      }
      address {
        tokenBalances {
          tokenType
          tokenAddress
          tokenId
          owner {
            identity
          }
          tokenNfts {
            erc6551Accounts {
              address {
                addresses
              }
            }
          }
        }
      }
    }
  }
}`;

export const tokenDetailsQuery = `query MyQuery($tokenAddress: Address, $tokenId: String, $blockchain: TokenBlockchain!, $limit: Int) {
  TokenBalances(
    input: {filter: {tokenAddress: {_eq: $tokenAddress}, tokenId: {_eq: $tokenId}}, blockchain: $blockchain, limit: $limit}
  ) {
    TokenBalance {
      owner {
        identity
      }
      amount
      tokenAddress
      tokenId
      tokenType
      tokenNfts {
        contentValue {
          image {
            medium
          }
        }
      }
    }
  }
}`;
