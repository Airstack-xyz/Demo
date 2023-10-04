import { TokenAddress } from '../pages/TokenHolders/types';

export function getCommonNftOwnersQuery(
  token1: TokenAddress,
  token2: TokenAddress
) {
  return `query CommonNftOwners($limit: Int) {
    ethereum: TokenBalances(
      input: {filter: {tokenAddress: {_eq: "${token1.address}"}}, blockchain: ethereum, limit: $limit}
    ) {
      TokenBalance {
        tokenId
        tokenAddress
        tokenType
        formattedAmount
        blockchain
        token {
          logo {
            small
          }
          projectDetails {
            imageUrl
          }
        }
        tokenNfts {
          contentValue {
            video
            image {
              small
              medium
            }
          }
          erc6551Accounts {
            address {
              identity
            }
          }
        }
        owner {
          tokenBalances(input: {filter: {tokenAddress: {_eq: "${token2.address}"}}, blockchain: ${token2.blockchain}}) {
            tokenId
            tokenAddress
            tokenType
            formattedAmount
            blockchain
            token {
              logo {
                small
              }
              projectDetails {
                imageUrl
              }
            }
            tokenNfts {
              contentValue {
                video
                image {
                  small
                  medium
                }
              }
              erc6551Accounts {
                address {
                  identity
                }
              }
            }
            owner {
              identity
              addresses
              socials {
                blockchain
                dappName
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
      input: {filter: {tokenAddress: {_eq: "${token1.address}"}}, blockchain: polygon, limit: $limit}
    ) {
      TokenBalance {
        tokenId
        tokenAddress
        tokenType
        formattedAmount
        blockchain
        token {
          logo {
            small
          }
          projectDetails {
            imageUrl
          }
        }
        tokenNfts {
          contentValue {
            video
            image {
              small
              medium
            }
          }
          erc6551Accounts {
            address {
              identity
            }
          }
        }
        owner {
          tokenBalances(input: {filter: {tokenAddress: {_eq: "${token2.address}"}}, blockchain: ${token2.blockchain}}) {
            tokenId
            tokenAddress
            tokenType
            formattedAmount
            blockchain
            token {
              logo {
                small
              }
              projectDetails {
                imageUrl
              }
            }
            tokenNfts {
              contentValue {
                video
                image {
                  small
                  medium
                }
              }
              erc6551Accounts {
                address {
                  identity
                }
              }
            }
            owner {
              identity
              addresses
              socials {
                blockchain
                dappName
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
        tokenType
        formattedAmount
        blockchain
        token {
          logo {
            small
          }
          projectDetails {
            imageUrl
          }
        }
        tokenNfts {
          contentValue {
            video
            image {
              small
              medium
            }
          }
          erc6551Accounts {
            address {
              identity
            }
          }
        }
        owner {
          identity
          addresses
          socials {
            blockchain
            dappName
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
        tokenType
        formattedAmount
        blockchain
        token {
          logo {
            small
          }
          projectDetails {
            imageUrl
          }
        }
        tokenNfts {
          contentValue {
            video
            image {
              small
              medium
            }
          }
          erc6551Accounts {
            address {
              identity
            }
          }
        }
        owner {
          identity
          addresses
          socials {
            blockchain
            dappName
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
