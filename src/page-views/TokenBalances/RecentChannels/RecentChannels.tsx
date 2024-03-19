import { SectionHeader } from '../SectionHeader';
import ImageWithFallback from '@/Components/ImageWithFallback';
import { farcasterPlaceholderImage } from '@/page-views/Channels/constants';
import { Link } from '@/Components/Link';
import classNames from 'classnames';
import { Participent, useGetChannels } from '@/hooks/useGetChannels';
import { Icon } from '@/Components/Icon';
import { createChannelsUrl } from '@/utils/createChannelsUrl';
import { useSearchInput } from '@/hooks/useSearchInput';
import { useCallback, useEffect } from 'react';
import { getActiveSocialInfoString } from '@/utils/activeSocialInfoString';
import { useLazyQuery } from '@airstack/airstack-react';
import { getFaracasterProfile } from '@/queries/socials/socials';
import {
  GetFaracasterProfileQuery,
  GetFaracasterProfileQueryVariables
} from '../../../../__generated__/airstack-types';

const loaderData = Array(3).fill({});

export function RecentChannels({ identity }: { identity: string }) {
  const [fetchData, { data }] = useLazyQuery<
    GetFaracasterProfileQuery,
    GetFaracasterProfileQueryVariables
  >(getFaracasterProfile);
  const farcaster = data?.Wallet?.farcaster?.[0];

  const { participants, loading } = useGetChannels(
    { identity, limit: 3 },
    Boolean(farcaster)
  );
  const [{ address }, setData] = useSearchInput();

  useEffect(() => {
    if (address.length > 0) {
      fetchData({
        identity: address[0]
      });
    }
  }, [fetchData, address]);

  const handleViewAll = useCallback(() => {
    if (!farcaster?.profileName || !farcaster?.profileTokenId) {
      return;
    }
    setData(
      {
        activeSocialInfo: getActiveSocialInfoString({
          profileNames: [farcaster?.profileName],
          profileTokenIds: [farcaster?.profileTokenId],
          dappName: 'farcaster',
          activeTab: 'channels',
          followerCount: farcaster?.followerCount || 0,
          followingCount: farcaster?.followingCount || 0
        })
      },
      { updateQueryParams: true }
    );
  }, [
    farcaster?.followerCount,
    farcaster?.followingCount,
    farcaster?.profileName,
    farcaster?.profileTokenId,
    setData
  ]);

  if ((data && !farcaster) || (!loading && participants?.length === 0)) {
    return null;
  }

  return (
    <div className="w-full sm:w-auto">
      <div className="mb-5 flex items-center justify-between ">
        <SectionHeader iconName="farcaster-flat" heading="Recent Channels" />
        {participants && participants?.length > 0 && (
          <li className="flex items-center justify-center">
            <button
              className="text-text-button text-sm"
              onClick={handleViewAll}
            >
              View all {'->'}
            </button>
          </li>
        )}
      </div>
      <ul
        className={classNames('flex flex-col gap-5', {
          'skeleton-loader': loading
        })}
      >
        {(loading ? loaderData : participants)?.map(
          (participant: Participent) => {
            const { channel, lastActionTimestamp } = participant;
            const host = channel?.leadProfiles?.[0]?.profileName;
            return (
              <li key={channel?.channelId}>
                <Link
                  to={createChannelsUrl({
                    address: channel?.channelId || '',
                    label: channel?.channelId || ''
                  })}
                  className={classNames(
                    'card hover:bg-card-hover rounded-18 flex items-center gap-5 p-2.5',
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
                    <div className="font-semibold flex items-center">
                      <span className="text-text-primary">
                        {channel?.name}{' '}
                      </span>
                      <span className="text-text-secondary text-xs ml-1.5">
                        /{channel?.channelId}
                      </span>
                    </div>
                    {host && (
                      <div className="text-text-secondary text-sm mt-3">
                        Host: {host}
                      </div>
                    )}
                    <div className="text-text-secondary text-xs flex items-center mt-3">
                      <Icon name="clock" height={13} width={13} />{' '}
                      <span className="ml-1">{lastActionTimestamp}</span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          }
        )}
      </ul>
    </div>
  );
}
