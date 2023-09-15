export const socialFollowersDetailsQuery = `query SocialFollowersDetails($identity: Identity!, $dappName: SocialFollowDappName, $limit: Int) {
  SocialFollowers(
    input: {filter: {identity: {_eq: $identity}, dappName: {_eq: $dappName}}, blockchain: ALL, limit: $limit}
  ) {
    Follower {
      id
      blockchain
      dappName
      dappSlug
      followerProfileId
      followerTokenId
      followingProfileId
      followerAddress {
        identity
        addresses
        socials {
          blockchain
          dappName
          dappSlug
          profileName
          profileTokenId
          profileTokenAddress
        }
        primaryDomain {
          name
        }
        domains {
          dappName
          name
        }
        xmtp {
          isXMTPEnabled
        }
      }
    }
  }
}`;
