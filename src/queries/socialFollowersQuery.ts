import {
  SocialFollowLogicalFilters,
  SocialFollowQueryFilters
} from '../pages/TokenBalances/SocialFollows/types';

export const getSocialFollowersQuery = ({
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

  if (queryFilters.followingProfileIds) {
    variables.push('$followingProfileIds: [String!]');
    filters.push('followingProfileId: {_in: $followingProfileIds}');
  }
  if (queryFilters.followerDappNames) {
    variables.push('$followerDappNames: [SocialDappName!]');
    socialFilters.push('dappName: {_in: $followerDappNames}');
  }
  if (queryFilters.followerDappNames) {
    variables.push('$followerDappNames: [SocialDappName!]');
    socialFilters.push('dappName: {_in: $followerDappNames}');
  }
  if (queryFilters.followerCount) {
    variables.push('$followerCount: Int');
    socialFilters.push('followerCount: {_gt: $followerCount}');
  }
  if (queryFilters.followerPrimaryDomain) {
    variables.push('$followerPrimaryDomain: Boolean');
    domainFilters.push('isPrimary: {_eq: $followerPrimaryDomain}');
  }

  const variablesString = variables.join(',');
  const filtersString = filters.join(',');
  const socialFiltersString = socialFilters.join(',');
  const domainFiltersString = domainFilters.join(',');

  return `query SocialFollowersDetails(${variablesString}) {
    SocialFollowers(
      input: {filter: {${filtersString}}, blockchain: ALL, limit: $limit}
    ) {
      Follower {
        id
        blockchain
        dappName
        dappSlug
        followerProfileId
        followingProfileId
        followerAddress {
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
              ? `mutualFollow: socialFollowings(input: {filter: {identity: {_eq: $identity}, dappName: {_eq: $dappName}}, limit: 1}) {
            Following {
              id
              followingProfileId
            }
          }`
              : ''
          }
          ${
            logicalFilters.alsoFollow
              ? `alsoFollow: socialFollowers(input: {filter: {identity: {_eq: $identity}, dappName: {_eq: ${logicalFilters.alsoFollow}}}, limit: 1}) {
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
