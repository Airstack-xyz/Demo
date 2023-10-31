import { useMemo, useState } from 'react';
import { Icon, IconType } from '../../../Components/Icon';
import classNames from 'classnames';

export type FollowCombinationParams = {
  dappName: string;
  profileName1: string;
  profileTokenId1: string;
  profileName2: string;
  profileTokenId2: string;
  followerCount?: number;
  followingCount?: number;
  followerTab?: boolean;
};

export type FollowCombinationSectionType = {
  name: string;
  values: {
    profileName1: string;
    profileTokenId1: string;
    profileName2: string;
    profileTokenId2: string;
    followerCount?: number;
    followingCount?: number;
  }[];
};

export type FollowCombinationType = {
  name: string;
  image: string;
  dappName: string;
  followInfo?: {
    icon: IconType;
    text: string;
  };
  sections: FollowCombinationSectionType[];
};

const maxItemCount = 7;
const minItemCount = 1;

type FollowCombinationSectionProps = {
  dappName: string;
  onFollowClick?: (params: FollowCombinationParams) => void;
  onShowMoreClick?: (address: string, values: string[], type?: string) => void;
} & FollowCombinationSectionType;

function FollowCombinationSection({
  dappName,
  name,
  values,
  onFollowClick,
  onShowMoreClick
}: FollowCombinationSectionProps) {
  const [showMax, setShowMax] = useState(false);

  const items = useMemo(() => {
    if (!showMax) {
      return values?.slice(0, minItemCount);
    }
    return values?.slice(0, maxItemCount);
  }, [showMax, values]);

  return (
    <div className="grid grid-cols-2 mt-1.5 ml-[34px]">
      <div className="text-text-secondary items-start my-1 ellipsis">
        {name}
      </div>
      <ul className="overflow-hidden">
        {items?.map((item, index) => (
          <li key={index} className="flex">
            <div
              className="px-3 py-1 rounded-18 ellipsis hover:bg-glass cursor-pointer"
              onClick={() => onFollowClick?.({ dappName, ...item })}
            >
              {item.profileName1}
            </div>
          </li>
        ))}
        {!showMax && values?.length > minItemCount && (
          <li
            onClick={() => {
              setShowMax(prev => !prev);
            }}
            className="text-text-button font-medium cursor-pointer px-3"
          >
            see more
          </li>
        )}
        {showMax && values.length > maxItemCount && (
          <li
            onClick={() => {
              if (showMax && values.length > maxItemCount) {
                onShowMoreClick?.(name, [values[0].profileName1], dappName);
                return;
              }
            }}
            className="text-text-button font-medium cursor-pointer px-3"
          >
            see all
          </li>
        )}
      </ul>
    </div>
  );
}

type FollowInfoProps = {
  icon: IconType;
  text: string;
  className?: string;
};

function FollowInfo({ icon, text, className }: FollowInfoProps) {
  return (
    <div
      className={classNames(
        'flex items-center font-medium text-text-secondary',
        className
      )}
    >
      <Icon name={icon} height={16} width={16} />
      <span className="ml-1 ellipsis">{text}</span>
    </div>
  );
}

type FollowCombinationProps = {
  onFollowClick?: (params: FollowCombinationParams) => void;
  onShowMoreClick?: (address: string, values: string[], type?: string) => void;
} & FollowCombinationType;

export function FollowCombination({
  name,
  image,
  dappName,
  sections,
  followInfo,
  onFollowClick,
  onShowMoreClick
}: FollowCombinationProps) {
  return (
    <div className="text-sm mb-7 last:mb-0">
      <div className="flex items-center">
        <div className="rounded-full h-[25px] w-[25px] border mr-2 overflow-hidden flex-row-center">
          <img src={image} className="w-full" />
        </div>
        <span className="first-letter:uppercase">{name}</span>
      </div>
      {followInfo && (
        <FollowInfo
          icon={followInfo.icon}
          text={followInfo.text}
          className="mt-2 mb-1.5 ml-[34px]"
        />
      )}
      {sections?.map(item => (
        <FollowCombinationSection
          key={item.name}
          name={item.name}
          values={item.values}
          dappName={dappName}
          onFollowClick={onFollowClick}
          onShowMoreClick={onShowMoreClick}
        />
      ))}
    </div>
  );
}
