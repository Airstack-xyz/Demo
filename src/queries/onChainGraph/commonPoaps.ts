import { QUERY_LIMIT } from '../../pages/OnchainGraph/constants';

export const userPoapsEventIdsQuery = `query UserPoapsEventIds($user: Identity!) {
    Poaps(input: {filter: {owner: {_eq: $user}}, blockchain: ALL, limit: 200, order: {createdAtBlockNumber: DESC }}) {
      Poap {
        eventId
        poapEvent {
          isVirtualEvent
        }
      }
    }
  }`;

export const poapsByEventIdsQuery = `query PoapsByEventId($poaps: [String!]) {
    Poaps(input: {filter: {eventId: {_in: $poaps}}, blockchain: ALL, limit: ${QUERY_LIMIT}}) {
      Poap {
        eventId
        poapEvent {
          eventName
          contentValue {
            image {
              extraSmall
            }
          }
        }
        attendee {
          owner {
            addresses
            primaryDomain {
              name
              tokenNft {
                tokenId
                address
                blockchain
              }
            }
            domains {
              name
              isPrimary
              tokenNft {
                tokenId
                address
                blockchain
              }
            }
            socials {
              dappName
              blockchain
              profileName
              profileHandle
              profileImage
              profileTokenId
              profileTokenAddress
              profileImageContentValue {
                image {
                  small
                }
              }
            }
            xmtp {
              isXMTPEnabled
            }
          }
        }
      }
    }
  }`;
