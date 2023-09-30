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
    '$dappName: SocialDappName',
    '$limit: Int'
  ];
  const filters = ['identity: {_eq: $identity}', 'dappName: {_eq: $dappName}'];
  const socialFilters = [];
  const domainFilters = [];

  const logicalQueries = [];

  if (queryFilters.followerProfileId) {
    variables.push('$followerProfileId: String!');
    filters.push('followerProfileId: {_eq: $followerProfileId}');
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

  if (logicalFilters.mutualFollow) {
    logicalQueries.push(`mutualFollow: socialFollowers(input: {filter: {identity: {_eq: $identity}, dappName: {_eq: $dappName}}, limit: 1}) {
      Follower {
        id
        followerProfileId
      }
    }`);
  }
  if (logicalFilters.alsoFollow) {
    logicalQueries.push(`alsoFollow: socialFollowings(input: {filter: {identity: {_eq: $identity}, dappName: {_eq: ${logicalFilters.alsoFollow}}}, limit: 1}) {
      Following {
        id
        followingProfileId
      }
    }`);
  }
  if (logicalFilters.holdingData) {
    const { address, token, blockchain, eventId } = logicalFilters.holdingData;
    if (token === 'POAP') {
      logicalQueries.push(`poaps(
        input: {filter: {eventId: {_in: ["${eventId}"]}}, limit: 1}
      ) {
        tokenId
        tokenAddress
        tokenType
        blockchain
        formattedAmount
        poapEvent {
          eventId
          contentValue {
            image {
              extraSmall
            }
          }
        }
      }`);
    } else {
      logicalQueries.push(`tokenBalances(
        input: {filter: {tokenAddress: {_in: ["${address}"]}}, blockchain: ${blockchain}, limit: 1}
      ) {
        tokenId
        tokenAddress
        tokenType
        blockchain
        formattedAmount
        token {
          logo {
            small
          }
          projectDetails {
            imageUrl
          }
        }
        tokenNfts {
          contentValue {
            image {
              extraSmall
            }
          }
        }
      }`);
    }
  }

  const variablesString = variables.join(',');
  const filtersString = filters.join(',');
  const socialFiltersString = socialFilters.join(',');
  const domainFiltersString = domainFilters.join(',');

  const logicalQueriesString = logicalQueries.join('\n');

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
          ${logicalQueriesString}
        }
      }
    }
  }`;
};
