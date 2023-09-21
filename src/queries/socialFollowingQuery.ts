import {
  SocialFollowLogicalFilters,
  SocialFollowQueryFilters
} from '../pages/TokenBalances/SocialFollows/types';

export const getSocialFollowingsQuery = ({
  queryFilters,
  logicalFilters
}: {
  queryFilters: SocialFollowQueryFilters;
  logicalFilters: SocialFollowLogicalFilters;
}) => {
  const variables = [
    '$identity: Identity!',
    '$dappName: SocialFollowDappName',
    '$limit: Int'
  ];
  const socialFilters = [];
  const domainFilters = [];

  if (queryFilters.followingDappNames) {
    variables.push('$followingDappNames: [SocialDappName!]');
    socialFilters.push('dappName: {_in: $followingDappNames}');
  }
  if (queryFilters.followingCount) {
    variables.push('$followingCount: Int');
    socialFilters.push('followingCount: {_gt: $followingCount}');
  }
  if (queryFilters.followingPrimaryDomain) {
    variables.push('$followingPrimaryDomain: Boolean');
    domainFilters.push('isPrimary: {_eq: $followingPrimaryDomain}');
  }

  const variablesString = variables.join(',');
  const socialFiltersString = socialFilters.join(',');
  const domainFiltersString = domainFilters.join(',');

  return `query SocialFollowingsDetails(${variablesString}) {
    SocialFollowings(
      input: {filter: {identity: {_eq: $identity}, dappName: {_eq: $dappName}}, blockchain: ALL, limit: $limit}
    ) {
      Following {
        id
        blockchain
        dappName
        dappSlug
        followerProfileId
        followingProfileId
        followingAddress {
          identity
          addresses
          socials${
            socialFiltersString
              ? `(input: {filter: {${socialFiltersString}}})`
              : ''
          } {
            userId
            blockchain
            dappName
            dappSlug
            profileName
            profileImage
            profileTokenId
            profileTokenAddress
          }
          primaryDomain {
            name
          }
          domains${
            domainFiltersString
              ? `(input: {filter: {${domainFiltersString}}})`
              : ''
          } {
            dappName
            name
          }
          xmtp {
            isXMTPEnabled
          }
          ${
            logicalFilters.mutualFollow
              ? `socialFollowers(input: {filter: {identity: {_eq: $identity}, dappName: {_eq: $dappName}}, limit: 1}) {
            Follower {
              id
              followerProfileId
            }
          }`
              : ''
          }
        }
      }
    }
  }`;
};
