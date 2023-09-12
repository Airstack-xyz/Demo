export const socialDetailsQuery = `query GetSocials($identities: [Identity!], $dappSlug: SocialDappSlug) {
    Socials(
      input: {filter: {identity: {_in: $identities}, dappSlug: {_eq: $dappSlug}}, blockchain: ethereum}
    ) {
      Social {
        id
        dappName
        dappSlug
        profileName
        profileImage
        profileTokenId
        followerCount
        followingCount
        userCreatedAtBlockTimestamp
        userCreatedAtBlockNumber
      }
    }
  }`;
