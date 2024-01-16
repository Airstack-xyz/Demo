import { TokenAddress } from '../pages/TokenHolders/types';

export function getCommonPoapAndNftOwnersQuery({
  poap,
  token
}: {
  poap: TokenAddress;
  token: TokenAddress;
}) {
  return `query CommonPoapAndNftOwners($limit: Int) {
    Poaps(
      input: {filter: {poap: {_eq: "${
        poap.address
      }"}}, blockchain: ALL, limit: $limit}
    ) {
      Poap {
        id
        token
        tokenAddress
        blockchain
        poap
        poapEvent {
          contentValue {
            image {
              small
              medium
            }
            video {
              original
            }
            audio {
              original
            }
          }
          logo: contentValue {
            image {
              small
              medium
            }
          }
          blockchain
          eventName
        } 
        owner {
          tokenBalances(input: {filter: {tokenAddress: {_eq: "${
            token.address
          }"}}, blockchain: ${token.blockchain || 'ethereum'}}) {
            token
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
                video {
                  original
                }
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
              blockchain
              accounts {
                token
                tokenAddress
              }
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
          }
        }
      }
    }
  }`;
}
