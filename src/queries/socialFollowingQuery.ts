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

  const logicalQueries = [];

  if (queryFilters.followerProfileId) {
    variables.push('$followerProfileId: String!');
    filters.push('followerProfileId: {_eq: $followerProfileId}');
  }

  if (queryFilters.followerCount || logicalFilters.farcasterSocial) {
    const socialFilters = ['dappName: {_eq: farcaster}'];
    if (queryFilters.dappName === 'farcaster' && queryFilters.followingCount) {
      variables.push('$followingCount: Int');
      socialFilters.push('followingCount: {_gt: $followingCount}');
    }
    const socialFiltersString = socialFilters.join(',');

    logicalQueries.push(`farcasterSocials: socials(input: {filter: {${socialFiltersString}}, limit: 1}) {
      id
      profileTokenId
    }`);
  }
  if (queryFilters.followerCount || logicalFilters.lensSocial) {
    const socialFilters = ['dappName: {_eq: lens}'];
    if (queryFilters.dappName === 'lens' && queryFilters.followingCount) {
      variables.push('$followingCount: Int');
      socialFilters.push('followingCount: {_gt: $followingCount}');
    }
    const socialFiltersString = socialFilters.join(',');

    logicalQueries.push(`lensSocials: socials(input: {filter: {${socialFiltersString}}, limit: 1}) {
      id
      profileTokenId
    }`);
  }
  if (logicalFilters.mutualFollow) {
    logicalQueries.push(`mutualFollows: socialFollowers(input: {filter: {identity: {_eq: $identity}, dappName: {_eq: $dappName}}, limit: 1}) {
      Follower {
        id
        followerProfileId
      }
    }`);
  }
  if (logicalFilters.alsoFollow) {
    logicalQueries.push(`alsoFollows: socialFollowings(input: {filter: {identity: {_eq: $identity}, dappName: {_eq: ${logicalFilters.alsoFollow}}}, limit: 1}) {
      Following {
        id
        followingProfileId
      }
    }`);
  }
  if (logicalFilters.holdingData) {
    const { address, token, blockchain, eventId, customInputType } =
      logicalFilters.holdingData;
    if (token === 'POAP' || customInputType === 'POAP') {
      const poapEventId = eventId || address;
      logicalQueries.push(`holdings: poaps(
        input: {filter: {eventId: {_eq: "${poapEventId}"}}, limit: 1}
      ) {
        tokenId
        tokenAddress
        blockchain
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
      const otherInputs = ['limit: 1'];
      if (blockchain) {
        otherInputs.push(`blockchain: ${blockchain}`);
      }
      const otherInputsString = otherInputs.join(',');

      logicalQueries.push(`holdings: tokenBalances(
        input: {filter: {tokenAddress: {_eq: "${address}"}}${otherInputsString}}
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
          socials {
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
          domains {
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
