export const socialDetailsQuery = `query SocialDetails($identities: [Identity!], $dappName: SocialDappName) {
  Socials(
    input: {filter: {identity: {_in: $identities}, dappName: {_eq: $dappName}}, blockchain: ethereum}
  ) {
    Social {
      id
      blockchain
      dappName
      dappSlug
      profileName
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
