import { TokenAddress } from '../pages/TokenHolders/types';

const socialInput = '(input: {filter: {dappName: {_in: $socialFilters}}})';
const primaryDomainInput =
  '(input: {filter: {isPrimary: {_eq: $hasPrimaryDomain}}})';

export function getCommonNftOwnersQueryWithFilters(
  token1: TokenAddress,
  token2: TokenAddress,
  hasSocialFilters = false,
  hasPrimaryDomainFilter = false
) {
  return `query CommonNftOwners($limit: Int${
    hasSocialFilters ? ', $socialFilters: [SocialDappName!]' : ''
  }${hasPrimaryDomainFilter ? ', $hasPrimaryDomain: Boolean' : ''}) {
    ethereum: TokenBalances(
      input: {filter: {tokenAddress: {_eq: "${
        token1.address
      }"}}, blockchain: ethereum, limit: $limit}
    ) {
      TokenBalance {
        owner {
          tokenBalances(input: {filter: {tokenAddress: {_eq: "${
            token2.address
          }"}}, blockchain: ${token2.blockchain}}) {
            tokenId
            tokenAddress
            tokenType
            formattedAmount
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
              socials${hasSocialFilters ? socialInput : ''} {
                blockchain
                dappSlug
                profileName
              }
              primaryDomain {
                name
              }
              domains${hasPrimaryDomainFilter ? primaryDomainInput : ''} {
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
      input: {filter: {tokenAddress: {_eq: "${
        token1.address
      }"}}, blockchain: polygon, limit: $limit}
    ) {
      TokenBalance {
        owner {
          tokenBalances(input: {filter: {tokenAddress: {_eq: "${
            token2.address
          }"}}, blockchain: ${token2.blockchain}}) {
            tokenId
            tokenAddress
            tokenType
            formattedAmount
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
              socials${hasSocialFilters ? socialInput : ''} {
                blockchain
                dappSlug
                profileName
              }
              primaryDomain {
                name
              }
              domains${hasPrimaryDomainFilter ? primaryDomainInput : ''} {
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

export function getNftOwnersQueryWithFilters(
  token: string,
  hasSocialFilters = false,
  hasPrimaryDomainFilter = false
) {
  return `query NftOwners($limit: Int${
    hasSocialFilters ? ', $socialFilters: [SocialDappName!]' : ''
  }${hasPrimaryDomainFilter ? ', $hasPrimaryDomain: Boolean' : ''}) {
    ethereum: TokenBalances(
      input: {filter: {tokenAddress: {_eq: "${token}"}}, blockchain: ethereum, limit: $limit}
    ) {
      TokenBalance {
        tokenId
        tokenAddress
        tokenType
        formattedAmount
        owner {
          identity
          addresses
          socials${hasSocialFilters ? socialInput : ''} {
            blockchain
            dappSlug
            profileName
          }
          primaryDomain {
            name
          }
          domains${hasPrimaryDomainFilter ? primaryDomainInput : ''} {
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
        owner {
          identity
          addresses
          socials${hasSocialFilters ? socialInput : ''} {
            blockchain
            dappSlug
            profileName
          }
          primaryDomain {
            name
          }
          domains${hasPrimaryDomainFilter ? primaryDomainInput : ''} {
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
