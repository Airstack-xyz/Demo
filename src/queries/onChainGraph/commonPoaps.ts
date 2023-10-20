export const userPoapsEventIdsQuery = `query UserPoapsEventIds($user: Identity!) {
    Poaps(input: {filter: {owner: {_eq: $user}}, blockchain: ALL, limit: 200}) {
      Poap {
        eventId
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
            domains(input: {filter: {isPrimary: {_eq: true}}}) {
              name
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
