export const socialDetailsQuery = `query GetSocials($identities: [Identity!], $dappSlug: SocialDappSlug) {
    Socials(
      input: {filter: {identity: {_in: $identities}, dappSlug: {_eq: $dappSlug}}, blockchain: ethereum}
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
