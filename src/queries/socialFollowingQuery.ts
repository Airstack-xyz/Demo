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
  const _variables = [
    '$identity: Identity!',
    '$dappName: SocialFollowDappName',
    '$limit: Int'
  ];
  const _socialFilters = [];
  const _domainFilters = [];

  if (queryFilters.followingDappNames) {
    _variables.push('$followingDappNames: [SocialDappName!]');
    _socialFilters.push('dappName: {_in: $followingDappNames}');
  }
  if (queryFilters.followingCount) {
    _variables.push('$followingCount: Int');
    _socialFilters.push('followingCount: {_gt: $followingCount}');
  }
  if (queryFilters.followingPrimaryDomain) {
    _variables.push('$followingPrimaryDomain: Boolean');
    _domainFilters.push('isPrimary: {_eq: $followingPrimaryDomain}');
  }

  const _variablesString = _variables.join(',');
  const _socialFiltersString = _socialFilters.join(',');
  const _domainFiltersString = _domainFilters.join(',');

  return `query SocialFollowersDetails(${_variablesString}) {
    SocialFollowings(
      input: {filter: {identity: {_eq: $identity}, dappName: {_eq: $dappName}}, blockchain: ALL, limit: $limit}
    ) {
      Following {
        id
        blockchain
        dappName
        dappSlug
        followingProfileId
        followingAddress {
          identity
          addresses
          socials${
            _socialFiltersString
              ? `(input: {filter: {${_socialFiltersString}}})`
              : ''
          } {
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
            logicalFilters.alsoFollowOn
              ? `socialFollowings(input: {filter: {identity: {_eq: $identity}, dappName: {_eq: ${logicalFilters.alsoFollowOn}}}, limit: 1}) {
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
