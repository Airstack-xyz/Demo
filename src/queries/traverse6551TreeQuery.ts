export const AccountTraverseQuery = `query AccountTraverseDetails($address: Identity, $blockchain: TokenBlockchain!) {
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

export const WalletQuery = `query WalletDetails($address: Identity!) {
    Wallet(input: {identity: $address, blockchain: ethereum}) {
      identity
      addresses
      socials {
        blockchain
        dappName
        profileName
        profileHandle
      }
      primaryDomain {
        name
      }
      domains {
        name
      }
      xmtp {
        isXMTPEnabled
      }
    }
  }`;
