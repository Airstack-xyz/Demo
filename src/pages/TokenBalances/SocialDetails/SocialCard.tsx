import { CopyButton } from '../../../Components/CopyButton';
import { Social } from './types';

type SocialCardProps = {
  social: Social;
};

const PLACEHOLDER_IMAGE = 'images/placeholder.svg';

export function SocialCard({ social }: SocialCardProps) {
  return (
    <div className="flex items-center">
      <img
        className="w-[180px] h-[180px] object-cover rounded-2xl"
        src={social.profileImage || PLACEHOLDER_IMAGE}
      />
      <div className="m-6">
        <div className="flex items-center">
          <img
            className="w-6 h-6 object-cover rounded"
            src={social.profileImage || PLACEHOLDER_IMAGE}
          />
          <div className="pl-2 pr-1 text-base">{social.profileName}</div>
          <div className="text-text-secondary text-sm">
            #{social.profileTokenId}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-3 text-sm">
          <div>Created date</div>
          <div className="text-text-secondary">
            {social.userCreatedAtBlockTimestamp}
          </div>
          <div>Created at (block)</div>
          <div className="text-text-secondary">
            {social.userCreatedAtBlockNumber}
          </div>
          <div>Transfer hash</div>
          <div className="text-text-secondary flex items-center gap-1">
            0x8d295d18...aaa54 <CopyButton value={social.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
