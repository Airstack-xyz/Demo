import { useLazyQuery } from '@airstack/airstack-react';
import { useCallback, useEffect, useState } from 'react';
import { Icon } from '../../../Components/Icon';
import { Tab, TabContainer } from '../../../Components/Tab';
import { UpdateUserInputs } from '../../../hooks/useSearchInput';
import { socialDetailsQuery } from '../../../queries/socialDetails';
import {
  SocialInfo,
  getActiveSocialInfoString
} from '../../../utils/activeSocialInfoString';
import { Filters } from './Filters';
import { SocialCard, SocialCardLoader } from './SocialCard';
import { Social } from './types';

type SocialDetailsProps = {
  identities: string[];
  socialInfo: SocialInfo;
  setQueryData: UpdateUserInputs;
};

export function SocialDetails({
  identities,
  socialInfo,
  setQueryData
}: SocialDetailsProps) {
  const [followerTabActive, setFollowerTabActive] = useState(
    socialInfo.followerTab
  );

  const [fetchDetails, { data: detailsData, loading: detailsLoading }] =
    useLazyQuery(socialDetailsQuery, {
      identities,
      dappSlug: socialInfo.dappSlug
    });

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleClose = useCallback(() => {
    setQueryData(
      {
        activeSocialInfo: ''
      },
      { updateQueryParams: true }
    );
  }, [setQueryData]);

  const handleFiltersApply = useCallback(
    (filters: string[]) => {
      setQueryData(
        {
          activeSocialInfo: getActiveSocialInfoString({
            ...socialInfo,
            filters: filters
          })
        },
        { updateQueryParams: true }
      );
    },
    [setQueryData, socialInfo]
  );

  const socials: Social[] = detailsData?.Socials?.Social;

  return (
    <div className="max-w-[950px] text-sm m-auto w-[98vw] pt-10 sm:pt-0">
      <div className="flex items-center mb-7">
        <div className="flex items-center max-w-[60%] sm:w-auto overflow-hidden mr-1">
          <div
            className="flex items-center cursor-pointer hover:bg-glass-1 px-2 py-1 rounded-full overflow-hidden"
            onClick={handleClose}
          >
            <Icon name="token-holders" height={20} width={20} />
            <span className="ml-1.5 text-text-secondary break-all cursor-pointer max-w-[90%] sm:max-w-[500px] ellipsis">
              Token balances of {identities.join(', ')}
            </span>
          </div>
          <span className="mr-2 text-text-secondary">/</span>
        </div>
        <div className="flex items-center flex-1">
          <Icon name="table-view" height={20} width={20} className="mr-2" />
          <span className="text-text-primary">
            <span className="capitalize">{socialInfo.dappName}</span> details
          </span>
        </div>
      </div>
      <div className="mt-2 flex">
        {!detailsLoading &&
          socials?.map(item => <SocialCard key={item.id} item={item} />)}
        {detailsLoading && <SocialCardLoader />}
      </div>
      <TabContainer>
        <Tab
          icon="nft-flat"
          header={`${socialInfo.followerCount} followers`}
          active={followerTabActive}
          onClick={() => setFollowerTabActive(true)}
        />
        <Tab
          icon="erc20"
          header={`${socialInfo.followingCount} following`}
          active={!followerTabActive}
          onClick={() => setFollowerTabActive(false)}
        />
      </TabContainer>
      <div className="flex items-center justify-end my-3">
        <Filters
          dappName={socialInfo.dappName}
          selectedFilters={socialInfo.filters}
          onApply={handleFiltersApply}
        />
      </div>
    </div>
  );
}
