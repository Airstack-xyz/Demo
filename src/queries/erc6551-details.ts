export const erc6551DetailsQuery = `query ERC6551Details($blockchain: TokenBlockchain!, $tokenAddress: Address, $tokenId: String) {
    Accounts(
      input: {blockchain: $blockchain, filter: {tokenAddress: {_eq: $tokenAddress}, tokenId: {_eq: $tokenId}}}
    ) {
      Account {
        deployer
        address {
          addresses
          tokenBalances {
            tokenType
            tokenAddress
            tokenId
            owner {
              identity
            }
            tokenNfts {
              lastTransferTimestamp
              lastTransferBlock
              lastTransferHash
              tokenURI
              token {
                tokenTraits
              }
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
