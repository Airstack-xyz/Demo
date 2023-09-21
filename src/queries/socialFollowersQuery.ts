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
    '$identity: Identity!',
    '$dappName: SocialDappName',
    '$limit: Int'
  ];
  const socialFilters = [];
  const domainFilters = [];

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
  const socialFiltersString = socialFilters.join(',');
  const domainFiltersString = domainFilters.join(',');

  return `query SocialFollowersDetails(${variablesString}) {
    SocialFollowers(
      input: {filter: {identity: {_eq: $identity}, dappName: {_eq: $dappName}}, blockchain: ALL, limit: $limit}
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
              ? `socialFollowings(input: {filter: {identity: {_eq: $identity}, dappName: {_eq: $dappName}}, limit: 1}) {
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
