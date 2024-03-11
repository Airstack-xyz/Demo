import { QUERY_LIMIT } from '../../page-views/OnchainGraph/constants';

export const socialFollowingsQuery = `query Followings($user: Identity!, $dappName: SocialDappName) {
    SocialFollowings(
      input: {filter: {identity: {_eq: $user}, dappName: {_eq: $dappName}}, blockchain: ALL, limit: ${QUERY_LIMIT}}
    ) {
      Following {
        followingAddress {
          addresses
          primaryDomain {
            name
            tokenNft {
              tokenId
              address
              blockchain
            }
          }
          domains {
            name
            isPrimary
            tokenNft {
              tokenId
              address
              blockchain
            }
          }
          socials {
            dappName
            blockchain
            profileName
            profileHandle
            profileImage
            profileTokenId
            profileTokenAddress
            profileImageContentValue {
              image {
                small
              }
            }
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
                  profileHandle
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
          tokenNft {
            tokenId
            address
            blockchain
          }
        }
        domains {
          name
          isPrimary
          tokenNft {
            tokenId
            address
            blockchain
          }
        }
        socials {
          dappName
          blockchain
          profileName
          profileHandle
          profileImage
          profileTokenId
          profileTokenAddress
          profileImageContentValue {
            image {
              small
            }
          }
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
                profileHandle
              }
            }
          }
        }
      }
    }
  }
}`;
