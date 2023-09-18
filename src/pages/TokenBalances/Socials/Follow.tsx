import classNames from 'classnames';
import { useMemo, useState } from 'react';

const maxItemCount = 7;
const minItemCount = 2;

export type SocialParams = {
  profileName?: string;
  dappName?: string;
  followerCount?: number;
  followingCount?: number;
  followerTab?: boolean;
};

type FollowProps = {
  dappName?: string;
  followerCount?: number;
  followingCount?: number;
  values: string[];
  image: string;
  onSocialClick?: (params: SocialParams) => void;
  onShowMoreClick?: (values: string[], type?: string) => void;
};

export function Follow({
  dappName,
  followerCount,
  followingCount,
  values,
  image,
  onSocialClick,
  onShowMoreClick
}: FollowProps) {
  const [showMax, setShowMax] = useState(false);

  const items = useMemo(() => {
    if (!showMax) {
      return values?.slice(0, minItemCount);
    }
    return values?.slice(0, maxItemCount);
  }, [showMax, values]);

  const getSocialClickHandler = (name: string, follow?: boolean) => () => {
    onSocialClick?.({
      profileName: name,
      dappName,
      followerCount,
      followingCount,
      followerTab: follow
    });
  };

  const showFollowInfo =
    followerCount != undefined || followingCount !== undefined;

  return (
    <div className="text-sm mb-7 last:mb-0">
      <div className="flex">
        <div className="flex flex-1 items-start">
          <div className="flex items-center">
            <div className="rounded-full h-[25px] w-[25px] border mr-2 overflow-hidden flex-row-center">
              {<img src={image} className="w-full" />}
            </div>
            <span className="first-letter:uppercase">{dappName}</span>
          </div>
        </div>
        <ul className="text-text-secondary w-1/2 overflow-hidden flex flex-col justify-center">
          {items?.map((value, index) => (
            <li key={index} className="mb-2.5 last:mb-0 flex">
              <div
                className={classNames('px-3 py-1 rounded-18 ellipsis', {
                  'hover:bg-glass cursor-pointer': typeof value !== 'object'
                })}
                onClick={getSocialClickHandler(value)}
              >
                {value}
              </div>
            </li>
          ))}
          {!showMax && values?.length > minItemCount && (
            <li
              onClick={() => {
                setShowMax(show => !show);
              }}
              className="text-text-button font-bold cursor-pointer px-3"
            >
              see more
            </li>
          )}
          {showMax && values.length > maxItemCount && (
            <li
              onClick={() => {
                if (showMax && values.length > maxItemCount) {
                  onShowMoreClick?.(values, dappName);
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
      {showFollowInfo && (
        <>
          <div className="flex mt-2">
            <div className="flex-1 ml-[34px]">Followers</div>
            <div className="w-1/2">
              <button
                className="px-3 py-1 rounded-18 text-text-secondary hover:bg-glass text-left"
                onClick={getSocialClickHandler(values[0], true)}
              >
                {followerCount}
              </button>
            </div>
          </div>

          <div className="flex mt-2">
            <div className="flex-1 ml-[34px]">Following</div>
            <div className="w-1/2">
              <button
                className="px-3 py-1 rounded-18 text-text-secondary hover:bg-glass text-left"
                onClick={getSocialClickHandler(values[0], false)}
              >
                {followingCount}
              </button>
            </div>
          </div>
          {/* <button
            className="text-text-button font-bold mt-2 ml-[34px]"
            onClick={getSocialClickHandler(values[0], true)}
          >
            See all {dappName} info
          </button> */}
        </>
      )}
    </div>
  );
}
