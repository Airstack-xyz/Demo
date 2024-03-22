import classNames from 'classnames';
import { useMemo, useState } from 'react';
import { Image } from '@/Components/Image';
import { ActiveTab } from '@/utils/activeSocialInfoString';
import { DappName } from '../types';

export type FollowParams = {
  dappName: DappName;
  profileName?: string;
  profileTokenId?: string;
  followerCount?: number;
  followingCount?: number;
  activeTab?: ActiveTab;
};

export type FollowSectionType = {
  profileName?: string;
  profileHandle: string;
  profileTokenId?: string;
  followerCount?: number;
  followingCount?: number;
};

export type FollowType = {
  dappName: DappName;
  sections: FollowSectionType[];
};

type FollowSectionProps = {
  dappName: DappName;
  image?: string;
  isFirstSection?: boolean;
  onFollowClick?: (params: FollowParams) => void;
  onShowMoreClick?: (values: string[], type?: string) => void;
} & FollowSectionType;

function FollowSection({
  dappName,
  image,
  profileName,
  profileHandle,
  profileTokenId,
  followerCount,
  followingCount,
  isFirstSection,
  onFollowClick
}: FollowSectionProps) {
  const getSocialClickHandler = (activeTab?: ActiveTab) => () => {
    onFollowClick?.({
      profileName,
      profileTokenId,
      dappName,
      followerCount,
      followingCount,
      activeTab
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
                <Image src={image || ''} className="w-full" />
              </div>
              <span className="first-letter:uppercase">{dappName}</span>
            </div>
          )}
        </div>
        <ul className="text-text-secondary w-1/2 overflow-hidden">
          <li className="flex">
            <div
              className="px-3 py-1 rounded-18 ellipsis hover:bg-hover-primary cursor-pointer"
              onClick={getSocialClickHandler()}
            >
              {profileHandle}
            </div>
          </li>
        </ul>
      </div>
      {followerCount != undefined && (
        <div className="flex items-center mt-2 text-text-secondary">
          <div className="flex-1 ml-[34px]">Followers</div>
          <div className="w-1/2">
            <button
              className="px-3 py-1 rounded-18 hover:bg-hover-primary text-left"
              onClick={getSocialClickHandler('followers')}
            >
              {followerCount}
            </button>
          </div>
        </div>
      )}
      {followingCount != undefined && (
        <div className="flex items-center mt-2 text-text-secondary">
          <div className="flex-1 ml-[34px]">Following</div>
          <div className="w-1/2">
            <button
              className="px-3 py-1 rounded-18 text-text-secondary hover:bg-hover-primary text-left"
              onClick={getSocialClickHandler('followings')}
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
  onShowMoreClick?: (sections: FollowSectionType[], dappName?: string) => void;
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
