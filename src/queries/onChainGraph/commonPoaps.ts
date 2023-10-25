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
    Poaps(input: {filter: {eventId: {_in: $poaps}}, blockchain: ALL, limit: 200}) {
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
            }
            domains {
              name
              isPrimary
            }
            socials {
              dappName
              blockchain
              profileName
              profileImage
              profileTokenId
              profileTokenAddress
            }
            xmtp {
              isXMTPEnabled
            }
          }
        }
      }
    }
  }`;
