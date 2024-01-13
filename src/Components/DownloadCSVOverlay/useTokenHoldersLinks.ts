import { useMemo, useCallback } from 'react';
import { getCommonOwnersPOAPsQuery } from '../../queries/commonOwnersPOAPsQuery';
import { createAppUrlWithQuery } from '../../utils/createAppUrlWithQuery';
import { useSearchInput } from '../../hooks/useSearchInput';
import { useOverviewTokens } from '../../store/tokenHoldersOverview';
import { sortByAddressByNonERC20First } from '../../utils/getNFTQueryForTokensHolder';
import {
  getActiveSnapshotInfo,
  getSnapshotQueryFilters
} from '../../utils/activeSnapshotInfoString';
import {
  getNftOwnersSnapshotQuery,
  getCommonNftOwnersSnapshotQuery
} from '../../queries/Snapshots/commonNftOwnersSnapshotQuery';
import {
  getNftOwnersQuery,
  getCommonNftOwnersQuery
} from '../../queries/commonNftOwnersQuery';
import { getCommonPoapAndNftOwnersQuery } from '../../queries/commonPoapAndNftOwnersQuery';
import { sortAddressByPoapFirst } from '../../utils/sortAddressByPoapFirst';
import { useTokenDetails } from '../../store/tokenDetails';
import { getRequestFilters } from '../../pages/TokenHolders/OverviewDetails/Tokens/filters';
import { getFilterablePoapsQuery } from '../../queries/overviewDetailsPoap';
import {
  getCommonNftOwnersSnapshotQueryWithFilters,
  getNftOwnersSnapshotQueryWithFilters
} from '../../queries/Snapshots/commonNftOwnersSnapshotQueryWithFilters';
import {
  getCommonNftOwnersQueryWithFilters,
  getNftOwnersQueryWithFilters
} from '../../queries/commonNftOwnersQueryWithFilters';
import { getCommonPoapAndNftOwnersQueryWithFilters } from '../../queries/commonPoapAndNftOwnersQueryWithFilters';

export function useTokenHoldersLinks() {
  const [
    {
      address: tokenAddress,
      activeView,
      tokenFilters,
      activeSnapshotInfo,
      activeTokenInfo
    }
  ] = useSearchInput();
  const [{ hasERC6551 }] = useTokenDetails([
    'hasERC6551',
    'owner',
    'accountAddress'
  ]);
  const [{ tokens: overviewTokens }] = useOverviewTokens(['tokens']);

  const snapshotInfo = useMemo(
    () => getActiveSnapshotInfo(activeSnapshotInfo),
    [activeSnapshotInfo]
  );

  const hasSomePoap = tokenAddress.some(token => !token.startsWith('0x'));
  const hasPoap = tokenAddress.every(token => !token.startsWith('0x'));

  const address = useMemo(() => {
    return sortByAddressByNonERC20First(tokenAddress, overviewTokens, hasPoap);
  }, [hasPoap, tokenAddress, overviewTokens]);

  const tokenOwnersQuery = useMemo(() => {
    if (address.length === 0) return '';
    if (address.length === 1) {
      if (snapshotInfo.isApplicable) {
        return getNftOwnersSnapshotQuery({
          address: address[0],
          snapshotFilter: snapshotInfo.appliedFilter
        });
      }
      return getNftOwnersQuery(address[0]);
    }
    if (hasSomePoap) {
      const tokens = sortAddressByPoapFirst(address);
      return getCommonPoapAndNftOwnersQuery(tokens[0], tokens[1]);
    }
    if (snapshotInfo.isApplicable) {
      return getCommonNftOwnersSnapshotQuery({
        address1: address[0],
        address2: address[1],
        snapshotFilter: snapshotInfo.appliedFilter
      });
    }
    return getCommonNftOwnersQuery(address[0], address[1]);
  }, [
    address,
    hasSomePoap,
    snapshotInfo.isApplicable,
    snapshotInfo.appliedFilter
  ]);

  const tokensQueryWithFilter = useMemo(() => {
    const requestFilters = getRequestFilters(tokenFilters);
    const hasSocialFilters = Boolean(requestFilters?.socialFilters);
    const hasPrimaryDomain = requestFilters?.hasPrimaryDomain;
    if (address.length === 0) return '';
    if (address.length === 1) {
      if (snapshotInfo.isApplicable) {
        return getNftOwnersSnapshotQueryWithFilters({
          address: address[0],
          snapshotFilter: snapshotInfo.appliedFilter,
          hasSocialFilters,
          hasPrimaryDomain
        });
      }
      return getNftOwnersQueryWithFilters(
        address[0],
        hasSocialFilters,
        hasPrimaryDomain
      );
    }
    if (hasSomePoap) {
      const tokens = sortAddressByPoapFirst(address);
      return getCommonPoapAndNftOwnersQueryWithFilters(
        tokens[0],
        tokens[1],
        hasSocialFilters,
        hasPrimaryDomain
      );
    }
    if (snapshotInfo.isApplicable) {
      return getCommonNftOwnersSnapshotQueryWithFilters({
        address1: address[0],
        address2: address[1],
        snapshotFilter: snapshotInfo.appliedFilter,
        hasSocialFilters,
        hasPrimaryDomain
      });
    }
    return getCommonNftOwnersQueryWithFilters(
      address[0],
      address[1],
      hasSocialFilters,
      hasPrimaryDomain
    );
  }, [
    tokenFilters,
    address,
    hasSomePoap,
    snapshotInfo.isApplicable,
    snapshotInfo.appliedFilter
  ]);

  const getLink = useCallback(() => {
    if (address.length === 0) return '';

    if (activeView) {
      const requestFilters = getRequestFilters(tokenFilters);
      const hasSocialFilters = Boolean(requestFilters?.socialFilters);
      const hasPrimaryDomain = requestFilters?.hasPrimaryDomain;
      let combinationsQueryLink = '';
      if (hasPoap) {
        const combinationsQuery = getFilterablePoapsQuery(
          address,
          hasSocialFilters,
          hasPrimaryDomain
        );
        combinationsQueryLink = createAppUrlWithQuery(combinationsQuery, {
          limit: 200,
          ...requestFilters
        });
      } else {
        if (snapshotInfo.isApplicable) {
          const queryFilters = getSnapshotQueryFilters(snapshotInfo);
          combinationsQueryLink = createAppUrlWithQuery(tokensQueryWithFilter, {
            limit: 200,
            ...queryFilters,
            ...requestFilters
          });
        } else {
          combinationsQueryLink = createAppUrlWithQuery(tokensQueryWithFilter, {
            limit: 200,
            ...requestFilters
          });
        }
      }
      return combinationsQueryLink;
    }

    if (!activeTokenInfo && !hasERC6551) {
      if (hasPoap) {
        const poapsQuery = getCommonOwnersPOAPsQuery(address);

        const poapLink = createAppUrlWithQuery(poapsQuery, {
          limit: 20
        });

        return poapLink;
      } else {
        let tokenLink = '';
        if (snapshotInfo.isApplicable) {
          const queryFilters = getSnapshotQueryFilters(snapshotInfo);
          tokenLink = createAppUrlWithQuery(tokenOwnersQuery, {
            limit: 20,
            ...queryFilters
          });
        } else {
          tokenLink = createAppUrlWithQuery(tokenOwnersQuery, {
            limit: 20
          });
        }
        return tokenLink;
      }
    }

    return '';
  }, [
    address,
    activeView,
    activeTokenInfo,
    hasERC6551,
    tokenFilters,
    hasPoap,
    snapshotInfo,
    tokensQueryWithFilter,
    tokenOwnersQuery
  ]);
  return getLink;
}
