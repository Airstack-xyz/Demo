export const socialDetailsQuery = `query SocialDetails($identities: [Identity!], $profileNames: [String!], $dappName: SocialDappName) {
  Socials(
    input: {filter: {identity: {_in: $identities}, profileName: {_in: $profileNames}, dappName: {_eq: $dappName}}, blockchain: ethereum}
  ) {
    Social {
      id
      blockchain
      dappName
      dappSlug
      profileName
      profileDisplayName
      profileBio
      profileImage
      profileTokenId
      profileTokenAddress
      followerCount
      followingCount
      userAddress
      userCreatedAtBlockTimestamp
      userCreatedAtBlockNumber
    }
  }
}`;
