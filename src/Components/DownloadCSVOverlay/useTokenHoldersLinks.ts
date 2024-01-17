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
import { getRequestFilters } from '../../pages/TokenHolders/OverviewDetails/Tokens/utils';

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

  const addresses = useMemo(() => {
    return sortByAddressByNonERC20First(tokenAddress, overviewTokens, hasPoap);
  }, [hasPoap, tokenAddress, overviewTokens]);

  const requestFilters = useMemo(() => {
    return getRequestFilters(tokenFilters);
  }, [tokenFilters]);

  const tokenOwnersQuery = useMemo(() => {
    if (addresses.length === 0) return '';
    if (addresses.length === 1) {
      if (snapshotInfo.isApplicable) {
        return getNftOwnersSnapshotQuery({
          tokenAddress: addresses[0],
          snapshotFilter: snapshotInfo.appliedFilter
        });
      }
      return getNftOwnersQuery({ tokenAddress: addresses[0] });
    }
    if (hasSomePoap) {
      const tokenAddresses = sortAddressByPoapFirst(addresses);
      return getCommonPoapAndNftOwnersQuery({
        poapAddress: tokenAddresses[0],
        tokenAddress: tokenAddresses[1]
      });
    }
    if (snapshotInfo.isApplicable) {
      return getCommonNftOwnersSnapshotQuery({
        tokenAddress1: addresses[0],
        tokenAddress2: addresses[1],
        snapshotFilter: snapshotInfo.appliedFilter
      });
    }
    return getCommonNftOwnersQuery({
      tokenAddress1: addresses[0],
      tokenAddress2: addresses[1]
    });
  }, [
    addresses,
    hasSomePoap,
    snapshotInfo.isApplicable,
    snapshotInfo.appliedFilter
  ]);

  const tokensQueryWithFilter = useMemo(() => {
    if (addresses.length === 0) return '';
    if (addresses.length === 1) {
      if (snapshotInfo.isApplicable) {
        return getNftOwnersSnapshotQueryWithFilters({
          tokenAddress: addresses[0],
          snapshotFilter: snapshotInfo.appliedFilter,
          ...requestFilters
        });
      }
      return getNftOwnersQueryWithFilters({
        tokenAddress: addresses[0],
        ...requestFilters
      });
    }
    if (hasSomePoap) {
      const tokenAddresses = sortAddressByPoapFirst(addresses);
      return getCommonPoapAndNftOwnersQueryWithFilters({
        poapAddress: tokenAddresses[0],
        tokenAddress: tokenAddresses[1],
        ...requestFilters
      });
    }
    if (snapshotInfo.isApplicable) {
      return getCommonNftOwnersSnapshotQueryWithFilters({
        tokenAddress1: addresses[0],
        tokenAddress2: addresses[1],
        snapshotFilter: snapshotInfo.appliedFilter,
        ...requestFilters
      });
    }
    return getCommonNftOwnersQueryWithFilters({
      tokenAddress1: addresses[0],
      tokenAddress2: addresses[1],
      ...requestFilters
    });
  }, [
    addresses,
    hasSomePoap,
    snapshotInfo.isApplicable,
    snapshotInfo.appliedFilter,
    requestFilters
  ]);

  const getLink = useCallback(() => {
    if (addresses.length === 0) return '';
    if (activeView) {
      let combinationsQueryLink = '';
      if (hasPoap) {
        const combinationsQuery = getFilterablePoapsQuery({
          tokenAddresses: addresses,
          ...requestFilters
        });
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
        const poapsQuery = getCommonOwnersPOAPsQuery({
          poapAddresses: addresses
        });

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
    addresses,
    activeView,
    activeTokenInfo,
    hasERC6551,
    hasPoap,
    requestFilters,
    snapshotInfo,
    tokensQueryWithFilter,
    tokenOwnersQuery
  ]);

  return getLink;
}
