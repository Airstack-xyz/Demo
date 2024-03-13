export const socialDetailsQuery = /* GraphQL */ `
  query SocialDetails(
    $identities: [Identity!]
    $profileNames: [String!]
    $dappName: SocialDappName
  ) {
    Socials(
      input: {
        filter: {
          identity: { _in: $identities }
          profileName: { _in: $profileNames }
          dappName: { _eq: $dappName }
        }
        blockchain: ethereum
      }
    ) {
      Social {
        id
        isDefault
        blockchain
        dappName
        website
        location
        identity
        userAddress
        profileName
        profileHandle
        profileDisplayName
        profileBio
        profileImage
        profileTokenId
        profileTokenAddress
        followerCount
        followingCount
        profileCreatedAtBlockTimestamp
        profileCreatedAtBlockNumber
        profileImageContentValue {
          image {
            small
          }
        }
        profileHandleNft {
          contentValue {
            image {
              extraSmall
            }
          }
        }
      }
    }
  }
`;
