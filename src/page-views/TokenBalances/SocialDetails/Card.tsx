import { Asset } from '@airstack/airstack-react';
import { Icon } from '../../../Components/Icon';
import LazyImage from '../../../Components/LazyImage';
import { formatDate } from '../../../utils';
import { Social } from './types';
import { checkBlockchainSupportForToken } from '../../../utils/activeTokenInfoString';
import { Image } from '@/Components/Image';
import { Chain } from '@airstack/airstack-react/constants';

export function CardLoader({ isLensDapp }: { isLensDapp: boolean }) {
  return (
    <div className="skeleton-loader w-full flex max-sm:flex-col max-sm:items-center gap-6">
      <div
        data-loader-type="block"
        className="w-[180px] h-[180px] shrink-0 rounded-2xl"
      />
      <div className="w-full flex flex-col max-sm:items-center">
        <div data-loader-type="block" className="h-6 w-[200px]" />
        <div
          data-loader-type="block"
          className="h-5 w-[246px] max-sm:w-full mt-3"
        />
        <div
          data-loader-type="block"
          className="h-5 w-[246px] max-sm:w-full mt-3"
        />
        <div
          data-loader-type="block"
          className="h-5 w-[246px] max-sm:w-full mt-3"
        />
        <div
          data-loader-type="block"
          className="h-5 w-[246px] max-sm:w-full mt-3"
        />
        {isLensDapp && (
          <div
            data-loader-type="block"
            className="h-5 w-[246px] max-sm:w-full mt-3"
          />
        )}
      </div>
    </div>
  );
}

export function Card({
  item,
  isLensDapp
}: {
  item: Social;
  isLensDapp: boolean;
}) {
  const profileImageUrl = item.profileImageContentValue?.image?.small;

  const lensTokenImageUrl =
    isLensDapp && item.profileHandleNft?.contentValue?.image?.extraSmall;

  const useAssetComponent =
    !profileImageUrl &&
    checkBlockchainSupportForToken(item?.blockchain as string);

  return (
    <div className="flex-1 flex max-sm:flex-col max-sm:items-center gap-6">
      {useAssetComponent ? (
        <Asset
          preset="medium"
          containerClassName="h-[180px] w-[180px]"
          imgProps={{ className: 'max-h-[180px] max-w-[180px]' }}
          chain={item?.blockchain as Chain}
          tokenId={item?.profileTokenId as string}
          address={item?.profileTokenAddress as string}
        />
      ) : (
        <LazyImage
          className="object-cover rounded-2xl h-[180px] w-[180px] shrink-0"
          src={profileImageUrl}
          height={180}
          width={180}
        />
      )}
      <div className="w-full mt-1">
        <div className="flex items-center max-sm:justify-center">
          {!!lensTokenImageUrl && (
            <Image
              src={lensTokenImageUrl}
              height={24}
              width={24}
              className="rounded-full mr-2"
            />
          )}
          <div className="mr-1 text-base">{item.profileHandle}</div>
          <div className="text-text-secondary text-sm">
            #{item.profileTokenId}
          </div>
          {item.isDefault && (
            <div className="flex items-center text-xs text-text-secondary ml-3">
              <Icon
                name="check-mark-circle"
                className="mr-1.5"
                height={12}
                width={12}
              />
              Default profile
            </div>
          )}
        </div>
        <div className="mt-3 grid grid-cols-[auto_1fr] [&>div:nth-child(even)]:text-text-secondary gap-x-4 gap-y-3 text-sm">
          <div>Display name</div>
          <div>{item.profileDisplayName || '--'}</div>
          <div>Bio</div>
          <div>{item.profileBio || '--'}</div>
          {isLensDapp ? (
            <>
              <div>Location</div>
              <div>{item.location || '--'}</div>
              <div>Website</div>
              <div>{item.website || '--'}</div>
            </>
          ) : null}
          <div>Created date</div>
          <div>
            {item.profileCreatedAtBlockTimestamp
              ? formatDate(item.profileCreatedAtBlockTimestamp)
              : '--'}
          </div>
          {isLensDapp ? null : (
            <>
              <div>Created at (block)</div>
              <div>{item.profileCreatedAtBlockNumber || '--'}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
