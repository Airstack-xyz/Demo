export const accountOwnerQuery = `query AccountQuery($accountAddress: Identity) {
  ethereum: Accounts(
    input: {blockchain: ethereum, filter: {address: {_eq: $accountAddress}}}
  ) {
    Account {
      tokenId
      blockchain
      tokenAddress
      address {
        tokenBalances {
          tokenId
          blockchain
          tokenAddress
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
      address {
        tokenBalances {
          tokenId
          blockchain
          tokenAddress
        }
      }
    }
  }
}`;