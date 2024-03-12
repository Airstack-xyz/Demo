// TODO: change ASC to DESC one the backend is fixed

export const farcasterParticipentsQuery = /* GraphQL */ `
  query FcChannelParticipants(
    $identity: Identity!
    $orderBy: OrderBy = ASC
    $limit: Int
  ) {
    FarcasterChannelParticipants(
      input: {
        filter: { participant: { _eq: $identity } }
        blockchain: ALL
        order: { lastActionTimestamp: $orderBy }
        limit: $limit
      }
    ) {
      FarcasterChannelParticipant {
        channel {
          name
          imageUrl
          channelId
          leadProfiles {
            profileName
          }
        }
      }
    }
  }
`;
