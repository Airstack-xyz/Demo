import { useQuery } from '@airstack/airstack-react';
import { SectionHeader } from '../SectionHeader';
import { farcasterParticipentsQuery } from '@/queries/channels/participents';
import {
  FcChannelParticipantsQuery,
  FcChannelParticipantsQueryVariables
} from '../../../../__generated__/airstack-types';
import ImageWithFallback from '@/Components/ImageWithFallback';
import { farcasterPlaceholderImage } from '@/page-views/Channels/constants';
import { Link } from '@/Components/Link';
import classNames from 'classnames';

const loaderData = Array(3).fill({});

export function RecentChannels({ identity }: { identity: string }) {
  const { data, loading: loadingQuery } = useQuery<
    FcChannelParticipantsQuery,
    FcChannelParticipantsQueryVariables
  >(farcasterParticipentsQuery, {
    identity,
    limit: 3
  });

  const loading = loadingQuery || !data;
  const participants = loading
    ? loaderData
    : data?.FarcasterChannelParticipants?.FarcasterChannelParticipant;

  return (
    <div className="w-full sm:w-auto">
      <div className="hidden mb-3 sm:block">
        <SectionHeader iconName="farcaster-flat" heading="Recent Channels" />
      </div>
      <ul
        className={classNames('flex flex-col gap-5', {
          'skeleton-loader': loading
        })}
      >
        {participants?.map(participant => {
          const { channel } = participant;
          const host = channel?.leadProfiles?.[0]?.profileName || '--';
          return (
            <li key={channel?.channelId}>
              <Link
                to={`/channels?address${channel?.channelId}`}
                className={classNames(
                  'card rounded-18 flex items-center gap-5 p-2.5',
                  {
                    '!border-none': loading
                  }
                )}
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
                <div>
                  <div className="font-semibold mb-3.5 flex items-center">
                    <span className="text-text-primary">{channel?.name} </span>
                    <span className="text-text-secondary text-xs ml-1.5">
                      /{channel?.channelId}
                    </span>
                  </div>
                  <div className="text-text-secondary text-sm">
                    Host: {host}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
        <li className="flex items-center justify-center">
          <button className="text-text-button font-medium">
            View all {'->'}
          </button>
        </li>
      </ul>
    </div>
  );
}
