import { TokenAddress } from '../page-views/TokenHolders/types';

export function getCommonPoapAndNftOwnersQuery({
  poapAddress,
  tokenAddress
}: {
  poapAddress: TokenAddress;
  tokenAddress: TokenAddress;
}) {
  return `query CommonPoapAndNftOwners($limit: Int) {
    Poaps(
      input: {filter: {eventId: {_eq: "${
        poapAddress.address
      }"}}, blockchain: ALL, limit: $limit}
    ) {
      Poap {
        id
        tokenId
        tokenAddress
        blockchain
        eventId
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
            tokenAddress.address
          }"}}, blockchain: ${tokenAddress.blockchain || 'ethereum'}}) {
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
                tokenId
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
