export function getCommonNftOwnersQuery(token1: string, token2: string) {
  return `query CommonNftOwners($limit: Int) {
    ethereum: TokenBalances(
      input: {filter: {tokenAddress: {_eq: "${token1}"}}, blockchain: ethereum, limit: $limit}
    ) {
      TokenBalance {
        tokenId
        tokenAddress
        token {
          logo {
            small
          }
          projectDetails {
            imageUrl
          }
        }
        owner {
          tokenBalances(input: {filter: {tokenAddress: {_eq: "${token2}"}}}) {
            tokenId
            tokenAddress
            token {
              logo {
                small
              }
              projectDetails {
                imageUrl
              }
            }
            owner {
              identity
              addresses
              socials {
                blockchain
                dappSlug
                profileName
              }
              primaryDomain {
                name
              }
              domains {
                chainId
                dappName
                name
              }
              xmtp {
                isXMTPEnabled
              }
            }
          }
        }
      }
    }
    polygon: TokenBalances(
      input: {filter: {tokenAddress: {_eq: "${token1}"}}, blockchain: polygon, limit: $limit}
    ) {
      TokenBalance {
        tokenId
        tokenAddress
        token {
          logo {
            small
          }
          projectDetails {
            imageUrl
          }
        }
        owner {
          tokenBalances(input: {filter: {tokenAddress: {_eq: "${token2}"}}}) {
            tokenId
            tokenAddress
            token {
              logo {
                small
              }
              projectDetails {
                imageUrl
              }
            }
            owner {
              identity
              addresses
              socials {
                blockchain
                dappSlug
                profileName
              }
              primaryDomain {
                name
              }
              domains {
                chainId
                dappName
                name
              }
              xmtp {
                isXMTPEnabled
              }
            }
          }
        }
      }
    }
  }`;
}

export function getNftOwnersQuery(token: string) {
  return `query NftOwners($limit: Int) {
    ethereum: TokenBalances(
      input: {filter: {tokenAddress: {_eq: "${token}"}}, blockchain: ethereum, limit: $limit}
    ) {
      TokenBalance {
        tokenId
        tokenAddress
        token {
          logo {
            small
          }
          projectDetails {
            imageUrl
          }
        }
        owner {
          identity
          addresses
          socials {
            blockchain
            dappSlug
            profileName
          }
          primaryDomain {
            name
          }
          domains {
            chainId
            dappName
            name
          }
          xmtp {
            isXMTPEnabled
          }
        }
      }
    }
    polygon: TokenBalances(
      input: {filter: {tokenAddress: {_eq: "${token}"}}, blockchain: polygon, limit: $limit}
    ) {
      TokenBalance {
        tokenId
        tokenAddress
        token {
          logo {
            small
          }
          projectDetails {
            imageUrl
          }
        }
        owner {
          identity
          addresses
          socials {
            blockchain
            dappSlug
            profileName
          }
          primaryDomain {
            name
          }
          domains {
            chainId
            dappName
            name
          }
          xmtp {
            isXMTPEnabled
          }
        }
      }
    }
  }`;
}
