import { QUERY_LIMIT } from '../../pages/OnchainGraph/constants';

export const socialFollowingsQuery = `query Followings($user: Identity!, $dappName: SocialDappName) {
    SocialFollowings(
      input: {filter: {identity: {_eq: $user}, dappName: {_eq: $dappName}}, blockchain: ALL, limit: ${QUERY_LIMIT}}
    ) {
      Following {
        followingAddress {
          addresses
          primaryDomain {
            name
          }
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
    input: {filter: {identity: {_eq: $user}, dappName: {_eq: $dappName}}, blockchain: ALL, limit: ${QUERY_LIMIT}}
  ) {
    Follower {
      followerAddress {
        addresses
        primaryDomain {
          name
        }
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
