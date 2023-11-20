export const socialDetailsQuery = `query SocialDetails($identities: [Identity!], $profileNames: [String!], $dappName: SocialDappName) {
  Socials(
    input: {filter: {identity: {_in: $identities}, profileName: {_in: $profileNames}, dappName: {_eq: $dappName}}, blockchain: ethereum}
  ) {
    Social {
      id
      isDefault
      blockchain
      dappName
      dappSlug
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
    }
  }
}`;
