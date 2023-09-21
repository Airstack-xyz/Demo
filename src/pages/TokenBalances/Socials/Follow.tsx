import classNames from 'classnames';
import { useMemo, useState } from 'react';

export type FollowParams = {
  dappName: string;
  profileName: string;
  profileTokenId?: string;
  followerCount?: number;
  followingCount?: number;
  followerTab?: boolean;
};

const maxItemCount = Infinity; // Not showing show more for v1 release
const minItemCount = 2;

type Section = {
  profileNames: string[];
  profileTokenId?: string;
  followerCount?: number;
  followingCount?: number;
};

type FollowSectionProps = {
  dappName: string;
  image?: string;
  isFirstSection?: boolean;
  onFollowClick?: (params: FollowParams) => void;
  onShowMoreClick?: (values: string[], type?: string) => void;
} & Section;

function FollowSection({
  dappName,
  profileNames,
  profileTokenId,
  followerCount,
  followingCount,
  image,
  isFirstSection,
  onFollowClick,
  onShowMoreClick
}: FollowSectionProps) {
  const [showMax, setShowMax] = useState(false);

  const items = useMemo(() => {
    if (!showMax) {
      return profileNames?.slice(0, minItemCount);
    }
    return profileNames?.slice(0, maxItemCount);
  }, [showMax, profileNames]);

  const getSocialClickHandler = (name: string, follow?: boolean) => () => {
    onFollowClick?.({
      profileName: name,
      profileTokenId,
      dappName,
      followerCount,
      followingCount,
      followerTab: follow
    });
  };

  const showFollowInfo =
    followerCount != undefined || followingCount !== undefined;

  return (
    <>
      <div className={classNames('flex', !isFirstSection && 'mt-2')}>
        <div className="flex flex-1 items-start">
          {isFirstSection && (
            <div className="flex items-center">
              <div className="rounded-full h-[25px] w-[25px] border mr-2 overflow-hidden flex-row-center">
                <img src={image} className="w-full" />
              </div>
              <span className="first-letter:uppercase">{dappName}</span>
            </div>
          )}
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
          {!showMax && profileNames?.length > minItemCount && (
            <li
              onClick={() => {
                setShowMax(show => !show);
              }}
              className="text-text-button font-bold cursor-pointer px-3"
            >
              see more
            </li>
          )}
          {showMax && profileNames.length > maxItemCount && (
            <li
              onClick={() => {
                if (showMax && profileNames.length > maxItemCount) {
                  onShowMoreClick?.(profileNames, dappName);
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
          <div className="flex mt-2 text-text-secondary">
            <div className="flex-1 ml-[34px]">Followers</div>
            <div className="w-1/2">
              <button
                className="px-3 py-1 rounded-18 hover:bg-glass text-left"
                onClick={getSocialClickHandler(profileNames[0], true)}
              >
                {followerCount}
              </button>
            </div>
          </div>
          <div className="flex mt-2 text-text-secondary">
            <div className="flex-1 ml-[34px]">Following</div>
            <div className="w-1/2">
              <button
                className="px-3 py-1 rounded-18 text-text-secondary hover:bg-glass text-left"
                onClick={getSocialClickHandler(profileNames[0], false)}
              >
                {followingCount}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

type FollowProps = {
  dappName: string;
  sections: Section[];
  image: string;
  onFollowClick?: (params: FollowParams) => void;
  onShowMoreClick?: (sections: Section[], dappName?: string) => void;
};

export function Follow({
  dappName,
  sections,
  image,
  onFollowClick,
  onShowMoreClick
}: FollowProps) {
  const [showMax, setShowMax] = useState(false);

  const items = useMemo(() => {
    if (!showMax) {
      return sections?.slice(0, minItemCount);
    }
    return sections?.slice(0, maxItemCount);
  }, [showMax, sections]);

  return (
    <div className="text-sm mb-7 last:mb-0">
      {items.map((item, index) => (
        <FollowSection
          {...item}
          key={index}
          isFirstSection={index === 0}
          dappName={dappName}
          image={image}
          onFollowClick={onFollowClick}
          onShowMoreClick={() => onShowMoreClick?.(sections, dappName)}
        />
      ))}
      {!showMax && sections?.length > minItemCount && (
        <button
          onClick={() => {
            setShowMax(show => !show);
          }}
          className="text-text-button font-bold cursor-pointer px-3"
        >
          see more
        </button>
      )}
      {showMax && sections.length > maxItemCount && (
        <button
          onClick={() => {
            if (showMax && sections.length > maxItemCount) {
              onShowMoreClick?.(sections, dappName);
              return;
            }
          }}
          className="text-text-button font-bold cursor-pointer px-3"
        >
          see all
        </button>
      )}
    </div>
  );
}
