import { useLazyQuery } from '@airstack/airstack-react';
import { useCallback, useEffect, useState } from 'react';
import { Icon } from '../../../Components/Icon';
import { Tab, TabContainer } from '../../../Components/Tab';
import { socialDetailsQuery } from '../../../queries/socialDetails';
import { SocialCard, SocialCardLoader } from './SocialCard';
import { Social } from './types';
import { MentionInput, MentionOutput } from './MentionInput';
import { showToast } from '../../../utils/showToast';
import { Filters } from './Filters';
import { UpdateUserInputs } from '../../../hooks/useSearchInput';
import {
  SocialInfo,
  getActiveSocialInfoString
} from '../../../utils/activeSocialInfoString';

type SocialDetailsProps = {
  identities: string[];
  socialInfo: SocialInfo;
  setQueryData: UpdateUserInputs;
};

const mentionValidationFn = ({ mentions }: MentionOutput) => {
  if (mentions.length === 0) {
    showToast('Please use @ to add token, NFT, or POAP', 'negative');
    return false;
  }
  if (mentions.length > 1) {
    showToast("Filter can't work with more than one entities", 'negative');
    return false;
  }
  return true;
};

const thresholdValidationFn = ({ text }: MentionOutput) => {
  const value = Number(text);
  if (!(Number.isInteger(value) && value > 0)) {
    showToast('Please enter positive integer', 'negative');
    return false;
  }
  return true;
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

  const handleMentionSubmit = useCallback(
    ({ rawText }: MentionOutput) => {
      setQueryData(
        {
          activeSocialInfo: getActiveSocialInfoString({
            ...socialInfo,
            mentionRawText: rawText
          })
        },
        { updateQueryParams: true }
      );
    },
    [setQueryData, socialInfo]
  );

  const handleMentionClear = useCallback(() => {
    setQueryData(
      {
        activeSocialInfo: getActiveSocialInfoString({
          ...socialInfo,
          mentionRawText: ''
        })
      },
      { updateQueryParams: true }
    );
  }, [setQueryData, socialInfo]);

  const handleThresholdSubmit = useCallback(
    ({ rawText }: MentionOutput) => {
      setQueryData(
        {
          activeSocialInfo: getActiveSocialInfoString({
            ...socialInfo,
            thresholdRawText: rawText
          })
        },
        { updateQueryParams: true }
      );
    },
    [setQueryData, socialInfo]
  );

  const handleThresholdClear = useCallback(() => {
    setQueryData(
      {
        activeSocialInfo: getActiveSocialInfoString({
          ...socialInfo,
          thresholdRawText: ''
        })
      },
      { updateQueryParams: true }
    );
  }, [setQueryData, socialInfo]);

  const socialDetailList: Social[] = detailsData?.Socials?.Social;

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
          socialDetailList?.map(item => (
            <SocialCard key={item.id} item={item} />
          ))}
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
      <div className="flex items-center justify-between my-3">
        <div className="flex flex-wrap gap-5">
          <MentionInput
            blurOnEnter
            defaultValue={socialInfo.mentionRawText}
            placeholder="Enter a token, NFT, or POAP to view overlap"
            className="w-[350px]"
            validationFn={mentionValidationFn}
            onSubmit={handleMentionSubmit}
            onClear={handleMentionClear}
          />
          <MentionInput
            blurOnEnter
            defaultValue={socialInfo.thresholdRawText}
            placeholder="Enter threshold amount"
            validationFn={thresholdValidationFn}
            onSubmit={handleThresholdSubmit}
            onClear={handleThresholdClear}
            disableSuggestions={true}
          />
        </div>
        <Filters />
      </div>
    </div>
  );
}
