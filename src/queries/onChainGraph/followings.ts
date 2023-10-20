export const socialFollowingsQuery = `query Followings($user: Identity!, $dappName: SocialDappName) {
    SocialFollowings(
      input: {filter: {identity: {_eq: $user}, dappName: {_eq: $dappName}}, blockchain: ALL, limit: 200}
    ) {
      Following {
        followingAddress {
          addresses
          domains(input: {filter: {isPrimary: {_eq: true}}}) {
            name
          }
          socials {
            dappName
            blockchain
            profileName
            profileImage
            profileTokenId
            profileTokenAddress
          }
          xmtp {
            isXMTPEnabled
          }
          mutualFollower: socialFollowers(
            input: {filter: {identity: {_eq: $user}, dappName: {_eq: $dappName}}}
          ) {
            Follower {
              followerAddress {
                socials {
                  profileName
                }
              }
            }
          }
        }
      }
    }
  }`;
