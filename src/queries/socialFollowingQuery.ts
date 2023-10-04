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
    '$identities: [Identity!]',
    '$dappName: SocialDappName',
    '$limit: Int'
  ];
  const filters = [
    'identity: {_in: $identities}',
    'dappName: {_eq: $dappName}'
  ];
  const socialFilters = [];
  const domainFilters = [];

  if (queryFilters.followerProfileIds) {
    variables.push('$followerProfileIds: [String!]');
    filters.push('followerProfileId: {_in: $followerProfileIds}');
  }
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
  const filtersString = filters.join(',');
  const socialFiltersString = socialFilters.join(',');
  const domainFiltersString = domainFilters.join(',');

  return `query SocialFollowingsDetails(${variablesString}) {
    SocialFollowings(
      input: {filter: {${filtersString}}, blockchain: ALL, limit: $limit}
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
              ? `mutualFollow: socialFollowers(input: {filter: {identity: {_in: $identities}, dappName: {_eq: $dappName}}, limit: 1}) {
            Follower {
              id
              followerProfileId
            }
          }`
              : ''
          }
          ${
            logicalFilters.alsoFollow
              ? `alsoFollow: socialFollowings(input: {filter: {identity: {_in: $identities}, dappName: {_eq: ${logicalFilters.alsoFollow}}}, limit: 1}) {
            Following {
              id
              followingProfileId
            }
          }`
              : ''
          }
        }
      }
    }
  }`;
};
