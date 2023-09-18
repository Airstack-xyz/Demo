import { useState, useMemo, ReactNode, useCallback } from 'react';
import { useSearchInput } from '../../../hooks/useSearchInput';
import classNames from 'classnames';
import { createFormattedRawInput } from '../../../utils/createQueryParamsWithMention';
import { getActiveSocialInfoString } from '../../../utils/activeSocialInfoString';

function SocialFollowInfo({
  dappName,
  followerCount,
  followingCount
}: {
  dappName: string;
  followerCount?: number;
  followingCount?: number;
}) {
  const [, setData] = useSearchInput();

  const getSocialClickHandler = useCallback(
    (followerTab?: boolean) => () => {
      setData(
        {
          activeSocialInfo: getActiveSocialInfoString({
            dappName,
            followerCount,
            followingCount,
            followerTab
          })
        },
        { updateQueryParams: true }
      );
    },
    [dappName, followerCount, followingCount, setData]
  );

  return (
    <div className="ml-[34px]">
      {Number.isInteger(followerCount) && (
        <div className="flex mt-2">
          <div className="flex-1">Followers</div>
          <button
            className="flex-1 px-3 py-1 rounded-18 text-text-secondary hover:bg-glass text-left"
            onClick={getSocialClickHandler(true)}
          >
            {followerCount}
          </button>
        </div>
      )}
      {Number.isInteger(followingCount) && (
        <div className="flex mt-2">
          <div className="flex-1">Following</div>
          <button
            className="flex-1 px-3 py-1 rounded-18 text-text-secondary hover:bg-glass text-left"
            onClick={getSocialClickHandler(false)}
          >
            {followingCount}
          </button>
        </div>
      )}
      <button
        className="text-text-button font-bold mt-2"
        onClick={getSocialClickHandler(true)}
      >
        See all {dappName} info
      </button>
    </div>
  );
}

const maxCount = 7;
const minCount = 2;

type SocialProps = {
  name: string;
  slug?: string;
  followerCount?: number;
  followingCount?: number;
  values: ReactNode[];
  image: string;
  onShowMore?: () => void;
};

export function Social({
  name,
  followerCount,
  followingCount,
  values,
  image,
  onShowMore
}: SocialProps) {
  const [, setData] = useSearchInput();

  const [showMax, setShowMax] = useState(false);

  const items = useMemo(() => {
    if (!showMax) {
      return values?.slice(0, minCount);
    }
    return values?.slice(0, maxCount);
  }, [showMax, values]);

  const getItemClickHandler = useCallback(
    (value: ReactNode) => () => {
      if (typeof value !== 'string' || value == '--') return;

      const isFarcaster = name.includes('farcaster');
      const farcasterId = `fc_fname:${value}`;

      const rawInput = createFormattedRawInput({
        type: 'ADDRESS',
        address: isFarcaster ? farcasterId : value,
        label: isFarcaster ? farcasterId : value,
        blockchain: 'ethereum'
      });

      setData(
        {
          rawInput: rawInput,
          address: isFarcaster ? [farcasterId] : [value],
          inputType: 'ADDRESS'
        },
        { updateQueryParams: true }
      );
    },
    [name, setData]
  );

  const showSocialFollowInfo =
    followerCount != undefined || followingCount !== undefined;

  return (
    <div className="text-sm mb-7 last:mb-0">
      <div className="flex">
        <div className="flex flex-1 items-start">
          <div className="flex items-center">
            <div className="rounded-full h-[25px] w-[25px] border mr-2 overflow-hidden flex-row-center">
              <img src={image} className="w-full" />
            </div>
            <span className="first-letter:uppercase">{name}</span>
          </div>
        </div>
        <ul className="text-text-secondary w-1/2 overflow-hidden flex flex-col justify-center">
          {items?.map((value, index) => (
            <li key={index} className="mb-2.5 last:mb-0 flex">
              <div
                className={classNames('px-3 py-1 rounded-18 ellipsis', {
                  'hover:bg-glass cursor-pointer': typeof value !== 'object'
                })}
                onClick={getItemClickHandler(value)}
              >
                {value}
              </div>
            </li>
          ))}
          {!showMax && values?.length > minCount && (
            <li
              onClick={() => {
                setShowMax(show => !show);
              }}
              className="text-text-button font-bold cursor-pointer px-3"
            >
              see more
            </li>
          )}
          {showMax && values.length > maxCount && (
            <li
              onClick={() => {
                if (showMax && values.length > maxCount) {
                  onShowMore?.();
                  return;
                }
              }}
              className="text-text-button font-bold cursor-pointer px-3"
            >
              see all
            </li>
          )}
        </ul>
      </div>
      {showSocialFollowInfo && (
        <SocialFollowInfo
          dappName={name}
          followerCount={followerCount}
          followingCount={followingCount}
        />
      )}
    </div>
  );
}
