export const socialFollowingsQuery = `query Followings($user: Identity!, $dappName: SocialDappName) {
    SocialFollowings(
      input: {filter: {identity: {_eq: $user}, dappName: {_eq: $dappName}}, blockchain: ALL, limit: 200}
    ) {
      Following {
        followingAddress {
          addresses
          domains {
            name
            isPrimary
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

export const socialFollowersQuery = `query Followers($user: Identity!, $dappName: SocialDappName) {
  SocialFollowers(
    input: {filter: {identity: {_eq: $user}, dappName: {_eq: $dappName}}, blockchain: ALL, limit: 200}
  ) {
    Follower {
      followerAddress {
        addresses
        domains {
          name
          isPrimary
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
        mutualFollower: socialFollowings(
          input: {filter: {identity: {_eq: $user}, dappName: {_eq: $dappName}}}
        ) {
          Following {
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
