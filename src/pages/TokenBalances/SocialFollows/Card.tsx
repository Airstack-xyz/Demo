import { Asset } from '../../../Components/Asset';
import { WalletAddress } from '../../../Components/WalletAddress';
import { Social } from './types';

export function CardLoader() {
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
      </div>
    </div>
  );
}

const PLACEHOLDER_IMAGE = 'images/placeholder.svg';

export function Card({ item }: { item: Social }) {
  return (
    <div className="flex max-sm:flex-col items-center">
      <img
        className="w-[180px] h-[180px] object-cover rounded-2xl"
        src={item.profileImage || PLACEHOLDER_IMAGE}
      />
      <div className="m-6">
        <div className="flex items-center max-sm:justify-center">
          {item.dappName === 'lens' && (
            <Asset
              preset="extraSmall"
              containerClassName="w-6 h-6 mr-2 rounded"
              chain={item.blockchain}
              tokenId={item.profileTokenId}
              address={item.profileTokenAddress}
            />
          )}
          <div className="mr-1 text-base">{item.profileName}</div>
          <div className="text-text-secondary text-sm">
            #{item.profileTokenId}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-3 text-sm">
          <div>Created date</div>
          <div className="text-text-secondary">
            {item.userCreatedAtBlockTimestamp}
          </div>
          <div>Created at (block)</div>
          <div className="text-text-secondary">
            {item.userCreatedAtBlockNumber}
          </div>
          <div>User address</div>
          <div className="text-text-secondary sm:w-[140px]">
            <WalletAddress address={item.userAddress} />
          </div>
        </div>
      </div>
    </div>
  );
}
