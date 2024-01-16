export const Resolve6551OwnerQuery = `query Resolve6551OwnerDetails($address: Identity, $blockchain: TokenBlockchain!) {
    Accounts(input: {filter: {address: {_eq: $address}}, blockchain: $blockchain}) {
      Account {
        nft {
          address
          tokenId
          tokenBalances {
            owner {
              identity
              accounts {
                nft {
                  address
                  tokenId
                  tokenBalances {
                    owner {
                      identity
                      accounts {
                        nft {
                          address
                          tokenId
                          tokenBalances {
                            owner {
                              identity
                              accounts {
                                nft {
                                  address
                                  tokenId
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }`;
