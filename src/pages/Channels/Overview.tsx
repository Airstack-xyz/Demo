import { ReactNode } from 'react';
import { FarcasterChannelDetailsQuery } from '../../../__generated__/airstack-types';
import { CopyButton } from '../../Components/CopyButton';
import ImageWithFallback from '../../Components/ImageWithFallback';
import { farcasterPlaceholderImage } from './constants';
import classNames from 'classnames';

function KeyValue({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <div className="mt-3.5 flex items-center" data-loader-type="block">
      <div className="text-text-primary w-40 mr-2">{label}</div>
      <div className="text-text-secondary max-w-full ellipsis flex-1">
        {value || '--'}
      </div>
    </div>
  );
}

type Channel = NonNullable<
  NonNullable<
    FarcasterChannelDetailsQuery['FarcasterChannels']
  >['FarcasterChannel']
>[0];
export function Overview({
  channelDetails,
  loading
}: {
  channelDetails?: Channel | null;
  loading: boolean;
}) {
  return (
    <div
      className={classNames(
        'bg-glass p-3.5 flex items-center border border-solid border-stroke-color my-9 rounded-18',
        {
          'skeleton-loader': loading
        }
      )}
    >
      <div
        data-loader-type="block"
        className="w-48 h-48 mr-6 rounded-md overflow-hidden"
      >
        <ImageWithFallback
          key={channelDetails?.imageUrl}
          src={channelDetails?.imageUrl}
          fallback={farcasterPlaceholderImage}
          className="h-full rounded-md overflow-hidden"
        />
      </div>
      <div className="overflow-hidden">
        <h2 className="flex items-center">
          <span className="text-base font-medium">{channelDetails?.name}</span>{' '}
          <span className="text-xs text-[#8B8EA0] flex items-center ml-1">
            /{' '}
            <span
              data-loader-type="block"
              className={classNames('text-[#8B8EA0]', {
                'inline-block w-[50px] h-[15px]': loading
              })}
            >
              {channelDetails?.channelId}
            </span>
          </span>
        </h2>
        <div className="text-sm">
          <KeyValue label="Description" value={channelDetails?.description} />
          <KeyValue
            label="Host"
            value={channelDetails?.leadProfiles?.[0]?.profileName}
          />
          <KeyValue
            label="URL"
            value={
              channelDetails?.url ? (
                <span className="flex items-center ellipsis">
                  <span className="mr-2"> {channelDetails?.url}</span>
                  <CopyButton value={channelDetails?.url} />
                </span>
              ) : null
            }
          />
          <KeyValue
            label="Created at"
            value={channelDetails?.createdAtTimestamp}
          />
        </div>
      </div>
    </div>
  );
}
