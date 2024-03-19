export const farcasterProfilesQuery = /* GraphQL */ `
  query FaracsterProfiles($fids: [String!]) {
    Socials(
      input: {
        filter: { dappName: { _eq: farcaster }, userId: { _in: $fids } }
        blockchain: ethereum
      }
    ) {
      Social {
        profileName
        profileDisplayName
        fid: userId
        profileImage
        profileImageContentValue {
          image {
            medium
          }
        }
      }
    }
  }
`;
