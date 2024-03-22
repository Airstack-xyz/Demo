import classNames from 'classnames';
import { FarcasterChannelsQuery } from '../../../../__generated__/airstack-types';
import ImageWithFallback from '../../ImageWithFallback';

export type Channel = NonNullable<
  NonNullable<
    NonNullable<FarcasterChannelsQuery>['FarcasterChannels']
  >['FarcasterChannel']
>[0];

export const ListItemLoader = () => {
  return (
    <div className="h-[36px] my-0.5 shrink-0 rounded-18 bg-[linear-gradient(111deg,#ffffff0f_-8.95%,#ffffff00_114%)] animate-pulse" />
  );
};

type ListItemProps = {
  item: Channel;
  isFocused?: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
};

const listItemClass = 'flex items-center py-2 px-2.5 rounded-18';

export default function ChannelListItem({
  item,
  isFocused,
  onClick,
  onMouseEnter
}: ListItemProps) {
  const image = item.imageUrl;
  const name = item?.name;
  const hostedBy = item?.leadProfiles?.[0]?.profileName;

  // for lens social - show profile name without 'lens/@'
  const formattedProfileName = name;

  return (
    <button
      tabIndex={-1}
      className={classNames(listItemClass, isFocused && 'bg-hover-primary')}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <ImageWithFallback
        src={image}
        fallback="/images/farcaster.svg"
        className="h-4 w-4 rounded-full mr-1"
      />
      <span className="flex items-end overflow-hidden">
        <span className="text-sm text-white ellipsis pr-2">
          {formattedProfileName}
        </span>
        <span className="text-[10px] text-text-secondary pb-[1px] whitespace-nowrap leading-4">
          Hosted by {hostedBy}
        </span>
      </span>
    </button>
  );
}
