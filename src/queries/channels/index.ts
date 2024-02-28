export const farcasterChannelsSearchQuery = /* GraphQL */ `
  query FarcasterChannels($searchRegex: [String!], $limit: Int) {
    FarcasterChannels(
      input: {
        blockchain: ALL
        filter: { name: { _regex_in: $searchRegex } }
        limit: $limit
      }
    ) {
      FarcasterChannel {
        channelId
        name
        imageUrl
        leadProfiles {
          profileName
        }
      }
    }
  }
`;

export const farcasterChannelQuery = /* GraphQL */ `
  query FarcasterChannelDetails($channelId: String) {
    FarcasterChannels(
      input: { blockchain: ALL, filter: { channelId: { _eq: $channelId } } }
    ) {
      FarcasterChannel {
        channelId
        createdAtTimestamp
        description
        name
        url
        imageUrl
        leadProfiles {
          profileName
        }
      }
    }
  }
`;

export const farcasterParticipentsQuery = /* GraphQL */ `
  query FarcasterChannelParticipants(
    $channelId: String
    $limit: Int
    $orderBy: OrderBy
  ) {
    FarcasterChannelParticipants(
      input: {
        filter: { channelId: { _eq: $channelId } }
        blockchain: ALL
        limit: $limit
        order: { lastActionTimestamp: $orderBy }
      }
    ) {
      FarcasterChannelParticipant {
        lastActionTimestamp
        participant {
          fnames
          identity
          userAddress
          profileName
          fid: userId
          profileImage
          profileImageContentValue {
            image {
              small
            }
            video {
              original
            }
            animation_url {
              original
            }
          }
          userAssociatedAddressDetails {
            identity
            domains {
              name
            }
            primaryDomain {
              name
            }
            socials {
              dappName
              profileName
            }
          }
        }
      }
    }
  }
`;
