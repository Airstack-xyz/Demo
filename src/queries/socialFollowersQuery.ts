import {
  SocialFollowLogicalFilters,
  SocialFollowQueryFilters
} from '../pages/TokenBalances/SocialFollows/types';

const tokenBalanceFields = `
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
      medium
      extraSmall
    }
  }
}`;

export const getSocialFollowersQuery = ({
  queryFilters,
  logicalFilters
}: {
  queryFilters: SocialFollowQueryFilters;
  logicalFilters: SocialFollowLogicalFilters;
}) => {
  const variables = ['$dappName: SocialDappName', '$limit: Int'];
  const filters = ['dappName: {_eq: $dappName}'];

  const logicalQueries = [];

  if (queryFilters.identity) {
    variables.push('$identity: Identity!');
  }

  if (queryFilters.profileTokenId) {
    variables.push('$profileTokenId: String!');
    filters.push('followingProfileId: {_eq: $profileTokenId}');
  }

  if (queryFilters.followCount) {
    variables.push('$followCount: Int');
  }

  if (queryFilters.followCount || logicalFilters.farcasterSocial) {
    const socialFilters = ['dappName: {_eq: farcaster}'];
    if (queryFilters.dappName === 'farcaster' && queryFilters.followCount) {
      socialFilters.push('followerCount: {_gt: $followCount}');
    }
    const socialFiltersString = socialFilters.join(',');

    logicalQueries.push(`farcasterSocials: socials(input: {filter: {${socialFiltersString}}, limit: 1}) {
      id
      profileTokenId
    }`);
  }
  if (queryFilters.followCount || logicalFilters.lensSocial) {
    const socialFilters = ['dappName: {_eq: lens}'];
    if (queryFilters.dappName === 'lens' && queryFilters.followCount) {
      socialFilters.push('followerCount: {_gt: $followCount}');
    }
    const socialFiltersString = socialFilters.join(',');

    logicalQueries.push(`lensSocials: socials(input: {filter: {${socialFiltersString}}, limit: 1}) {
      id
      profileTokenId
    }`);
  }
  if (logicalFilters.mutualFollow) {
    logicalQueries.push(`mutualFollows: socialFollowings(input: {filter: {identity: {_eq: $identity}, dappName: {_eq: $dappName}}, limit: 1}) {
      Following {
        id
        followingProfileId
      }
    }`);
  }
  if (logicalFilters.alsoFollow) {
    logicalQueries.push(`alsoFollows: socialFollowers(input: {filter: {identity: {_eq: $identity}, dappName: {_eq: ${logicalFilters.alsoFollow}}}, limit: 1}) {
      Follower {
        id
        followerProfileId
      }
    }`);
  }
  if (logicalFilters.holdingData) {
    const { address, token, blockchain, eventId, customInputType } =
      logicalFilters.holdingData;
    if (customInputType === 'POAP' || token === 'POAP') {
      const poapEventId = eventId || address;
      logicalQueries.push(`poapHoldings: poaps(
        input: {filter: {eventId: {_eq: "${poapEventId}"}}, limit: 1}
      ) {
        tokenId
        tokenAddress
        blockchain
        poapEvent {
          eventId
          contentValue {
            image {
              medium
              extraSmall
            }
          }
        }
      }`);
    } else {
      if (!blockchain || blockchain === 'ethereum' || token === 'ADDRESS') {
        logicalQueries.push(`ethereumHoldings: tokenBalances(
            input: {filter: {tokenAddress: {_eq: "${address}"}}, blockchain: ethereum, limit: 1}
          ) {
            ${tokenBalanceFields}
          }`);
      }
      if (!blockchain || blockchain === 'polygon' || token === 'ADDRESS') {
        logicalQueries.push(`polygonHoldings: tokenBalances(
            input: {filter: {tokenAddress: {_eq: "${address}"}}, blockchain: polygon, limit: 1}
          ) {
            ${tokenBalanceFields}
          }`);
      }
    }
  }

  const variablesString = variables.join(',');
  const filtersString = filters.join(',');

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
          socials {
            userId
            blockchain
            dappName
            dappSlug
            profileName
            profileHandle
            profileImage
            profileTokenId
            profileTokenAddress
            profileImageContentValue {
              image {
                extraSmall
              }
            }
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
