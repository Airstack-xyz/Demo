import './styles.css';
import ImageWithFallback from '@/Components/ImageWithFallback';
import { Participent, useGetChannels } from '@/hooks/useGetChannels';
import { farcasterPlaceholderImage } from '@/page-views/Channels/constants';
import classNames from 'classnames';
import { Link } from '@/Components/Link';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Icon } from '@/Components/Icon';
import { createChannelsUrl } from '@/utils/createChannelsUrl';

const LOADING_ROW_COUNT = 6;

const loaderItems = Array(LOADING_ROW_COUNT).fill(0);

function PariticipantItem({
  participant,
  loading
}: {
  participant?: Participent;
  loading?: boolean;
}) {
  const { channel, lastActionTimestamp } = participant || {};
  const host = channel?.leadProfiles?.[0]?.profileName;
  return (
    <Link
      to={createChannelsUrl({
        address: channel?.channelId || '',
        label: channel?.channelId || ''
      })}
      className={classNames('card rounded-18 flex items-center gap-5 p-2.5', {
        '!border-none': loading
      })}
      data-loader-type="block"
    >
      <div
        data-loader-type="block"
        className="size-[102px] rounded-xl overflow-hidden"
      >
        <ImageWithFallback
          key={channel?.imageUrl}
          src={channel?.imageUrl}
          fallback={farcasterPlaceholderImage}
          className="size-[102px] rounded-xl overflow-hidden"
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="font-semibold flex items-center">
          <span className="text-text-primary ellipsis">{channel?.name} </span>
          <span className="text-text-secondary text-xs ml-1.5">
            /{channel?.channelId}
          </span>
        </div>
        {host && (
          <div className="text-text-secondary text-sm mt-3">Host: {host}</div>
        )}
        <div className="text-text-secondary text-xs flex items-center mt-3">
          <Icon name="clock" height={13} width={13} />{' '}
          <span className="ml-1">{lastActionTimestamp}</span>
        </div>
      </div>
    </Link>
  );
}

export function ChannelsSection({ identity }: { identity: string }) {
  const { participants, pagination, loading } = useGetChannels({
    identity,
    limit: 24
  });

  const getNext = () => {
    if (loading || !pagination.hasNextPage) {
      return;
    }
    pagination.getNextPage();
  };

  return (
    <div className="">
      <InfiniteScroll
        hasMore={pagination.hasNextPage}
        next={getNext}
        dataLength={participants?.length || 0}
        loader={null}
        className="grid grid-cols-1 sm:grid-cols-3 gap-5"
      >
        {participants?.map(participant => {
          return (
            <PariticipantItem
              participant={participant}
              key={participant?.channel?.channelId}
            />
          );
        })}

        {loading &&
          loaderItems.map(index => (
            <div className="skeleton-loader" key={index}>
              <PariticipantItem loading />
            </div>
          ))}
      </InfiniteScroll>
      {!loading && participants?.length === 0 && (
        <div className="py-5 text-center font-semibold">No channels found!</div>
      )}
    </div>
  );
}
