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
  const filters = ['identity: {_eq: $identity}', 'dappName: {_eq: $dappName}'];
  const socialFilters = [];
  const domainFilters = [];

  const logicalQueries = [];

  if (queryFilters.followingProfileId) {
    variables.push('$followingProfileId: String!');
    filters.push('followingProfileId: {_eq: $followingProfileId}');
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

  if (logicalFilters.mutualFollow) {
    logicalQueries.push(`mutualFollow: socialFollowings(input: {filter: {identity: {_eq: $identity}, dappName: {_eq: $dappName}}, limit: 1}) {
      Following {
        id
        followingProfileId
      }
    }`);
  }
  if (logicalFilters.alsoFollow) {
    logicalQueries.push(`alsoFollow: socialFollowers(input: {filter: {identity: {_eq: $identity}, dappName: {_eq: ${logicalFilters.alsoFollow}}}, limit: 1}) {
      Follower {
        id
        followerProfileId
      }
    }`);
  }
  if (logicalFilters.holdingData) {
    const { address, token, blockchain, eventId } = logicalFilters.holdingData;
    if (token === 'POAP') {
      logicalQueries.push(`holdings: poaps(
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
      logicalQueries.push(`holdings: tokenBalances(
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
          ${logicalQueriesString}
        }
      }
    }
  }`;
};
