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
  const _variables = [
    '$identity: Identity!',
    '$dappName: SocialFollowDappName',
    '$limit: Int'
  ];
  const _socialFilters = [];
  const _domainFilters = [];

  if (queryFilters.followerDappNames) {
    _variables.push('$followerDappNames: [SocialDappName!]');
    _socialFilters.push('dappName: {_in: $followerDappNames}');
  }
  if (queryFilters.followerCount) {
    _variables.push('$followerCount: Int');
    _socialFilters.push('followerCount: {_gt: $followerCount}');
  }
  if (queryFilters.followerPrimaryDomain) {
    _variables.push('$followerPrimaryDomain: Boolean');
    _domainFilters.push('isPrimary: {_eq: $followerPrimaryDomain}');
  }

  const _variablesString = _variables.join(',');
  const _socialFiltersString = _socialFilters.join(',');
  const _domainFiltersString = _domainFilters.join(',');

  return `query SocialFollowersDetails(${_variablesString}) {
    SocialFollowers(
      input: {filter: {identity: {_eq: $identity}, dappName: {_eq: $dappName}}, blockchain: ALL, limit: $limit}
    ) {
      Follower {
        id
        blockchain
        dappName
        dappSlug
        followerProfileId
        followerAddress {
          identity
          addresses
          socials${
            _socialFiltersString
              ? `(input: {filter: {${_socialFiltersString}}})`
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
            _domainFiltersString
              ? `(input: {filter: {${_domainFiltersString}}})`
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
