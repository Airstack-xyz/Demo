import { MentionData } from '../../../Components/Input/types';
import {
  Follow,
  SocialFollowLogicalFilters,
  SocialFollowQueryFilters
} from './types';

export const MORE_THAN_N_FOLLOW_FILTER = '>n_follow';

export const ALSO_FOLLOW_FILTER = 'also_follow';

export const MUTUAL_FOLLOW_FILTER = 'mutual_follow';

export const getSocialFollowFilterData = ({
  filters,
  mention,
  dappName,
  identities,
  profileTokenIds
}: {
  filters: string[];
  mention?: MentionData | null;
  dappName: string;
  identities: string[];
  profileTokenIds: string[];
  isFollowerQuery: boolean;
}) => {
  const queryFilters: SocialFollowQueryFilters = {
    dappName,
    profileTokenId: profileTokenIds[0]
  };
  const logicalFilters: SocialFollowLogicalFilters = {};

  if (mention) {
    logicalFilters.holdingData = mention;
  }

  filters?.forEach(filter => {
    if (filter === 'farcaster') {
      logicalFilters.farcasterSocial = true;
    }
    if (filter === 'lens') {
      logicalFilters.lensSocial = true;
    }
    if (filter.startsWith(MORE_THAN_N_FOLLOW_FILTER)) {
      const [, count] = filter.split(':');
      queryFilters.followCount = Number(count);
    }
    if (filter.startsWith(MUTUAL_FOLLOW_FILTER)) {
      logicalFilters.mutualFollow = true;
    }
    if (filter.startsWith(ALSO_FOLLOW_FILTER)) {
      const [, dappName] = filter.split(':');
      logicalFilters.alsoFollow = dappName;
    }
  });

  // Add identity filter for mutualFollow and alsoFollow as these queries use that
  if (logicalFilters.mutualFollow || logicalFilters.alsoFollow) {
    queryFilters.identity = identities[0];
  }

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
    return (
      (item.followerAddress || item.followingAddress)?.lensSocials?.length > 0
    );
  });
}

function filterByFarcaster(items: Follow[]) {
  return items?.filter(item => {
    return (
      (item.followerAddress || item.followingAddress)?.farcasterSocials
        ?.length > 0
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

function filterByMoreThanNFollow(items: Follow[], dappName: string) {
  if (dappName === 'farcaster') {
    return filterByFarcaster(items);
  }
  if (dappName === 'lens') {
    return filterByLens(items);
  }
  return items;
}

function filterByMutualFollow(items: Follow[], isFollowerQuery: boolean) {
  if (isFollowerQuery)
    return items?.filter(item => {
      return item.followerAddress?.mutualFollows?.Following?.length > 0;
    });
  return items?.filter(item => {
    return item.followingAddress?.mutualFollows?.Follower?.length > 0;
  });
}

function filterByAlsoFollow(items: Follow[], isFollowerQuery: boolean) {
  if (isFollowerQuery)
    return items?.filter(item => {
      return item.followerAddress?.alsoFollows?.Follower?.length > 0;
    });
  return items?.filter(item => {
    return item.followingAddress?.alsoFollows?.Following?.length > 0;
  });
}

function filterByHoldings(items: Follow[]) {
  return items?.filter(item => {
    const follow = item.followerAddress || item.followingAddress;
    return (
      follow?.poapHoldings?.length > 0 ||
      follow?.ethereumHoldings?.length > 0 ||
      follow?.polygonHoldings?.length > 0
    );
  });
}

export const filterTableItems = ({
  items,
  filters,
  mention,
  dappName,
  isFollowerQuery
}: {
  items: Follow[];
  filters: string[];
  mention?: MentionData | null;
  dappName: string;
  isFollowerQuery: boolean;
}) => {
  let filteredItems = items;

  if (mention) {
    filteredItems = filterByHoldings(filteredItems);
  }

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
    if (filter.startsWith(MORE_THAN_N_FOLLOW_FILTER)) {
      filteredItems = filterByMoreThanNFollow(filteredItems, dappName);
    }
    if (filter.startsWith(MUTUAL_FOLLOW_FILTER)) {
      filteredItems = filterByMutualFollow(filteredItems, isFollowerQuery);
    }
    if (filter.startsWith(ALSO_FOLLOW_FILTER)) {
      filteredItems = filterByAlsoFollow(filteredItems, isFollowerQuery);
    }
  });

  return filteredItems;
};
