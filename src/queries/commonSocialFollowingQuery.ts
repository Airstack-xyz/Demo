export const socialFollowingDetailsQuery = `query SocialFollowingsDetails($identity: Identity!, $dappName: SocialFollowDappName, $limit: Int) {
  SocialFollowings(
    input: {filter: {identity: {_eq: $identity}, dappName: {_eq: $dappName}}, blockchain: ALL, limit: $limit}
  ) {
    Following {
      id
      blockchain
      dappName
      dappSlug
      followerProfileId
      followerTokenId
      followingProfileId
      followingAddress {
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
