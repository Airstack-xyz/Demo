export const accountOwnerQuery = `query AccountQuery($accountAddress: Identity) {
  ethereum: Accounts(
    input: {blockchain: ethereum, filter: {address: {_eq: $accountAddress}}}
  ) {
    Account {
      tokenId
      blockchain
      tokenAddress
      nft {
        tokenBalances {
          tokenId
          blockchain
          tokenAddress
          owner{
            identity
          }
        }
      }
    }
  }
  polygon: Accounts(
    input: {blockchain: polygon, filter: {address: {_eq: $accountAddress}}}
  ) {
    Account {
      tokenId
      blockchain
      tokenAddress
      nft {
        tokenBalances {
          tokenId
          blockchain
          tokenAddress
          owner{
            identity
          }
        }
      }
    }
  }
}`;
