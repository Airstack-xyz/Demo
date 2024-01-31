export const domainDetailsQuery = `query ENSDetails($name: String!) {
    Domain(input: {name: $name, blockchain: ethereum}) {
      isPrimary
      avatar
      name
      owner
      manager
      texts {
        key
        value
      }
      multiChainAddresses {
        symbol
        address
      }
      tokenNft {
        contentValue {
          image {
            small
          }
        }
      }
      createdAtBlockTimestamp
      expiryTimestamp
    }
  }`;
