import React from 'react';
import { SocialSearchItem } from './types';
import classNames from 'classnames';

export const ListItemLoader = () => {
  return (
    <div className="h-[38px] my-0.5 shrink-0 rounded-18 bg-[linear-gradient(111deg,#ffffff0f_-8.95%,#ffffff00_114%)] animate-pulse" />
  );
};

type ListItemProps = {
  item: SocialSearchItem;
  isFocused?: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
};

const iconMap: Record<string, string> = {
  lens: '/images/lens.svg',
  farcaster: '/images/farcaster.svg'
};

const listItemClass = 'flex items-center py-2 px-2.5 rounded-18';

export default function ListItem({
  item,
  isFocused,
  onClick,
  onMouseEnter
}: ListItemProps) {
  const image = iconMap[item.dappName];

  // for lens social - show profile name without 'lens/@'
  const formattedProfileName =
    item.dappName === 'lens' ? item.profileName.substring(6) : item.profileName;

  return (
    <button
      tabIndex={-1}
      className={classNames(
        listItemClass,
        isFocused &&
          'bg-[linear-gradient(111deg,#ffffff0f_-8.95%,#ffffff00_114%)]'
      )}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <img src={image} className="h-4 w-4 rounded-full mr-1" />
      <span className="text-sm text-white">{formattedProfileName}</span>
    </button>
  );
}
