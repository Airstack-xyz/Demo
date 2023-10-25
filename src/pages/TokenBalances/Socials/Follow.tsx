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

type Section = {
  profileName: string;
  profileTokenId?: string;
  followerCount?: number;
  followingCount?: number;
  hideFollowerCount?: boolean;
  hideFollowingCount?: boolean;
};

export type FollowType = {
  dappName: string;
  sections: Section[];
};

type FollowSectionProps = {
  dappName: string;
  image?: string;
  isFirstSection?: boolean;
  onFollowClick?: (params: FollowParams) => void;
  onShowMoreClick?: (addresses: string[], dataType?: string) => void;
} & Section;

function FollowSection({
  dappName,
  profileName,
  profileTokenId,
  followerCount,
  followingCount,
  hideFollowerCount,
  hideFollowingCount,
  image,
  isFirstSection,
  onFollowClick
}: FollowSectionProps) {
  const getSocialClickHandler = (follow?: boolean) => () => {
    onFollowClick?.({
      profileName,
      profileTokenId,
      dappName,
      followerCount,
      followingCount,
      followerTab: follow
    });
  };

  return (
    <>
      <div
        className={classNames('flex items-center', !isFirstSection && 'mt-2')}
      >
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
        <div className="text-text-secondary w-1/2">
          <button
            className="px-3 py-1 rounded-18 hover:bg-glass cursor-pointer ellipsis"
            onClick={getSocialClickHandler()}
          >
            {profileName}
          </button>
        </div>
      </div>
      {followerCount != undefined && !hideFollowerCount && (
        <div className="flex items-center mt-2 text-text-secondary">
          <div className="flex-1 ml-[34px]">Followers</div>
          <div className="w-1/2">
            <button
              className="px-3 py-1 rounded-18 hover:bg-glass text-left"
              onClick={getSocialClickHandler(true)}
            >
              {followerCount}
            </button>
          </div>
        </div>
      )}
      {followingCount != undefined && !hideFollowingCount && (
        <div className="flex items-center mt-2 text-text-secondary">
          <div className="flex-1 ml-[34px]">Following</div>
          <div className="w-1/2">
            <button
              className="px-3 py-1 rounded-18 text-text-secondary hover:bg-glass text-left"
              onClick={getSocialClickHandler(false)}
            >
              {followingCount}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

type FollowProps = {
  image: string;
  onFollowClick?: (params: FollowParams) => void;
  onShowMoreClick?: (sections: Section[], dappName?: string) => void;
} & FollowType;

const maxItemCount = Infinity; // Not showing show more for v1 release
const minItemCount = 2;

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
        />
      ))}
      {!showMax && sections?.length > minItemCount && (
        <button
          onClick={() => {
            setShowMax(show => !show);
          }}
          className="text-text-button font-bold cursor-pointer mt-2 ml-[34px]"
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
          className="text-text-button font-bold cursor-pointer mt-2 ml-[34px]"
        >
          see all
        </button>
      )}
    </div>
  );
}
