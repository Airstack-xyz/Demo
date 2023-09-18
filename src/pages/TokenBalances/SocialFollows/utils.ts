import {
  Follow,
  SocialFollowLogicalFilters,
  SocialFollowQueryFilters
} from './types';

export const MORE_THAN_N_FOLLOW_FILTER = 'moreThanNFollow';

export const ALSO_FOLLOW_ON_FILTER = 'alsoFollowOn';

export const getSocialFollowFilterData = ({
  filters,
  isFollowerQuery
}: {
  filters: string[];
  isFollowerQuery: boolean;
}) => {
  const queryFilters: SocialFollowQueryFilters = {};
  const logicalFilters: SocialFollowLogicalFilters = {};

  filters.forEach(filter => {
    if (filter === 'farcaster' || filter === 'lens') {
      const key = isFollowerQuery ? 'followerDappNames' : 'followingDappNames';
      if (!Object.hasOwn(queryFilters, key)) {
        queryFilters[key] = [];
      }
      queryFilters[key]?.push(filter);
    }
    if (filter === 'primaryEns') {
      const key = isFollowerQuery
        ? 'followerPrimaryDomain'
        : 'followingPrimaryDomain';
      queryFilters[key] = true;
    }
    if (filter.startsWith(MORE_THAN_N_FOLLOW_FILTER)) {
      const key = isFollowerQuery ? 'followerCount' : 'followingCount';
      const [, count] = filter.split(':');
      queryFilters[key] = Number(count);
    }
    if (filter.startsWith(ALSO_FOLLOW_ON_FILTER)) {
      const [, dappName] = filter.split(':');
      logicalFilters.alsoFollowOn = dappName;
    }
  });

  return { queryFilters, logicalFilters };
};

function filterByPrimaryEns(items: Follow[]) {
  return items?.filter(
    item => (item.followerAddress || item.followingAddress)?.primaryDomain
  );
}

function filterByEns(items: Follow[]) {
  return items?.filter(
    item => (item.followerAddress || item.followingAddress)?.domains?.length > 0
  );
}

function filterByLens(items: Follow[]) {
  return items?.filter(item => {
    return (item.followerAddress || item.followingAddress)?.socials?.find(
      ({ dappName }) => dappName === 'lens'
    );
  });
}

function filterByFarcaster(items: Follow[]) {
  return items?.filter(item => {
    return (item.followerAddress || item.followingAddress)?.socials?.find(
      ({ dappName }) => dappName === 'farcaster'
    );
  });
}

function filterByXmtp(items: Follow[]) {
  return items?.filter(item => {
    return (item.followerAddress || item.followingAddress)?.xmtp?.find(
      ({ isXMTPEnabled }) => isXMTPEnabled
    );
  });
}

function filterByAlsoFollowOn(items: Follow[]) {
  return items?.filter(item => {
    return (
      (item.followerAddress || item.followingAddress)?.socialFollowings
        ?.Following?.length > 0
    );
  });
}

export const filterTableItems = ({
  items,
  filters
}: {
  items: Follow[];
  filters: string[];
}) => {
  let filteredItems = items;

  filters.forEach(filter => {
    if (filter === 'primaryEns') {
      filteredItems = filterByPrimaryEns(filteredItems);
    }
    if (filter === 'ens') {
      filteredItems = filterByEns(filteredItems);
    }
    if (filter === 'lens') {
      filteredItems = filterByLens(filteredItems);
    }
    if (filter === 'farcaster') {
      filteredItems = filterByFarcaster(filteredItems);
    }
    if (filter === 'xmtp') {
      filteredItems = filterByXmtp(filteredItems);
    }
    if (filter.startsWith(ALSO_FOLLOW_ON_FILTER)) {
      filteredItems = filterByAlsoFollowOn(filteredItems);
    }
  });

  return filteredItems;
};
