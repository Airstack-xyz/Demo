import { Asset, Image } from '../../../Components/Asset';
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
          containerClassName="w-[180px] h-[180px] [&>img]:w-[180px] [&>img]:max-w-[180px]"
          chain={item.blockchain}
          tokenId={item.profileTokenId}
          address={item.profileTokenAddress}
        />
      ) : (
        <Image
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
              <div>Default profile</div>
              <div>{item.isDefault ? 'yes' : 'no'}</div>
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
          <div>{item.profileCreatedAtBlockTimestamp || '--'}</div>
          <div>Created at (block)</div>
          <div>{item.profileCreatedAtBlockNumber || '--'}</div>
        </div>
      </div>
    </div>
  );
}
