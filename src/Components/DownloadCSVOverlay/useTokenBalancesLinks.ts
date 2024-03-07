import { useMemo, useCallback } from 'react';
import { useSearchInput } from '../../hooks/useSearchInput';
import { getActiveSocialInfo } from '../../utils/activeSocialInfoString';
import { createAppUrlWithQuery } from '../../utils/createAppUrlWithQuery';
import { getSocialFollowersQuery } from '../../queries/socialFollowersQuery';
import { getSocialFollowingsQuery } from '../../queries/socialFollowingQuery';
import { getSocialFollowFilterData } from '../../page-views/TokenBalances/SocialDetails/utils';

export function useTokenBalancesLinks() {
  const [{ address, activeTokenInfo, activeSocialInfo }] = useSearchInput();

  const showTokenDetails = Boolean(activeTokenInfo);

  const socialInfo = useMemo(
    () => getActiveSocialInfo(activeSocialInfo),
    [activeSocialInfo]
  );

  const getLink = useCallback(() => {
    if (address.length === 0) return '';
    const isFollowerQuery = Boolean(socialInfo.followerTab);

    if (!showTokenDetails && socialInfo.isApplicable) {
      const socialFollowersFilterData = getSocialFollowFilterData({
        ...socialInfo.followerData,
        dappName: socialInfo.dappName,
        identities: address,
        profileTokenIds: socialInfo.profileTokenIds,
        isFollowerQuery: true
      });
      const socialFollowingsFilterData = getSocialFollowFilterData({
        ...socialInfo.followingData,
        dappName: socialInfo.dappName,
        identities: address,
        profileTokenIds: socialInfo.profileTokenIds,
        isFollowerQuery: false
      });

      const socialFollowersDetailsQuery = getSocialFollowersQuery(
        socialFollowersFilterData
      );
      const socialFollowingDetailsQuery = getSocialFollowingsQuery(
        socialFollowingsFilterData
      );

      const socialFollowersDetailsLink = createAppUrlWithQuery(
        socialFollowersDetailsQuery,
        {
          limit: 10,
          ...socialFollowersFilterData.queryFilters
        }
      );

      const socialFollowingDetailsLink = createAppUrlWithQuery(
        socialFollowingDetailsQuery,
        {
          limit: 10,
          ...socialFollowingsFilterData.queryFilters
        }
      );

      if (isFollowerQuery) {
        return socialFollowersDetailsLink;
      }

      return socialFollowingDetailsLink;
    }
    return '';
  }, [
    address,
    socialInfo.followerTab,
    socialInfo.isApplicable,
    socialInfo.followerData,
    socialInfo.dappName,
    socialInfo.profileTokenIds,
    socialInfo.followingData,
    showTokenDetails
  ]);

  return getLink;
}
