import { Asset } from '../../../Components/Asset';
import { CopyButton } from '../../../Components/CopyButton';
import { Social } from './types';

type SocialCardProps = {
  item: Social;
};

const PLACEHOLDER_IMAGE = 'images/placeholder.svg';

export function SocialCardLoader() {
  return (
    <div className="skeleton-loader w-full flex max-sm:flex-col items-center">
      <div
        data-loader-type="block"
        className="w-[180px] h-[180px] shrink-0 rounded-2xl"
      />
      <div className="p-6 w-full">
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

export function SocialCard({ item }: SocialCardProps) {
  return (
    <div className="flex max-sm:flex-col items-center">
      <img
        className="w-[180px] h-[180px] object-cover rounded-2xl"
        src={item.profileImage || PLACEHOLDER_IMAGE}
      />
      <div className="m-6">
        <div className="flex items-center">
          <Asset
            preset="extraSmall"
            containerClassName="w-6 h-6 rounded"
            chain={item.blockchain}
            tokenId={item.profileTokenId}
            address={item.profileTokenAddress}
          />
          <div className="pl-2 pr-1 text-base">{item.profileName}</div>
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
          <div className="text-text-secondary flex sm:w-[140px] gap-1">
            <span className="ellipsis">{item.userAddress}</span>
            <span>
              <CopyButton value={item.userAddress} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
