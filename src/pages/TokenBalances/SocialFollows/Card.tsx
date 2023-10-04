import { Asset } from '../../../Components/Asset';
import { Icon } from '../../../Components/Icon';
import LazyImage from '../../../Components/LazyImage';
import { formatDate } from '../../../utils';
import { Social } from './types';

export function CardLoader({ isLensDapp }: { isLensDapp: boolean }) {
  return (
    <div className="skeleton-loader w-full flex max-sm:flex-col items-center">
      <div
        data-loader-type="block"
        className="w-[180px] h-[180px] shrink-0 rounded-2xl"
      />
      <div className="p-6 w-full flex flex-col max-sm:items-center">
        <div data-loader-type="block" className="h-6 w-[200px]" />
        <div
          data-loader-type="block"
          className="h-5 w-[246px] max-sm:w-full mt-4"
        />
        <div
          data-loader-type="block"
          className="h-5 w-[246px] max-sm:w-full mt-3"
        />
        <div
          data-loader-type="block"
          className="h-5 w-[246px] max-sm:w-full mt-3"
        />
        {!isLensDapp && (
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
  return (
    <div className="flex-1 flex max-sm:flex-col items-center">
      {isLensDapp ? (
        <Asset
          preset="medium"
          containerClassName="h-[180px] w-[180px]"
          imgProps={{ className: 'max-w-[180px] max-h-[180px]' }}
          chain={item.blockchain}
          tokenId={item.profileTokenId}
          address={item.profileTokenAddress}
        />
      ) : (
        <LazyImage
          className="w-[180px] h-[180px] object-cover rounded-2xl"
          src={item.profileImage}
        />
      )}
      <div className="p-6 w-full">
        <div className="flex items-center max-sm:justify-center">
          <div className="mr-1 text-base">{item.profileName}</div>
          <div className="text-text-secondary text-sm">
            #{item.profileTokenId}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-[auto_1fr] [&>div:nth-child(even)]:text-text-secondary gap-x-4 gap-y-3 text-sm">
          {isLensDapp ? (
            <>
              {item.isDefault ? (
                <>
                  <div className="flex items-center">
                    <Icon
                      name="check-mark-circle"
                      className="mr-1.5"
                      height={14}
                      width={14}
                    />
                    Default profile
                  </div>
                  <div />
                </>
              ) : null}
            </>
          ) : (
            <>
              <div>Display name</div>
              <div>{item.profileDisplayName || '--'}</div>
              <div>Bio</div>
              <div>{item.profileBio || '--'}</div>
            </>
          )}
          <div>Created date</div>
          <div>
            {item.profileCreatedAtBlockTimestamp
              ? formatDate(item.profileCreatedAtBlockTimestamp)
              : '--'}
          </div>
          <div>Created at (block)</div>
          <div>{item.profileCreatedAtBlockNumber || '--'}</div>
        </div>
      </div>
    </div>
  );
}
