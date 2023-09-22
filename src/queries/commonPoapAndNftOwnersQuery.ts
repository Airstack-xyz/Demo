import { TokenAddress } from '../pages/TokenHolders/types';

export function getCommonPoapAndNftOwnersQuery(
  eventId: TokenAddress,
  tokenId: TokenAddress
) {
  return `query CommonPoapAndNftOwners($limit: Int) {
    Poaps(
      input: {filter: {eventId: {_eq: "${eventId.address}"}}, blockchain: ALL, limit: $limit}
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
            video
            audio
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
          tokenBalances(input: {filter: {tokenAddress: {_eq: "${tokenId.address}"}}, blockchain: ${tokenId.blockchain}}) {
            tokenId
            tokenAddress
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
