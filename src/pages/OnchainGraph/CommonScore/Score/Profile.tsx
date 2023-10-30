import { Chain } from '@airstack/airstack-react/constants';
import { Asset } from '../../../../Components/Asset';
import { Social } from '../../../TokenBalances/types';

export function Profile({ social }: { social: Social | null }) {
  const blockchain =
    social?.blockchain !== 'ethereum' && social?.blockchain !== 'polygon'
      ? ''
      : social?.blockchain;
  return (
    <Asset
      preset="medium"
      containerClassName="w-full h-full flex items-center justify-center"
      chain={blockchain as Chain}
      tokenId={blockchain ? social?.profileTokenId || '' : ''}
      address={
        // if there is profile image then set address to empty string so that it doesn't show the token image
        social?.profileImage ? '' : social?.profileTokenAddress || ''
      }
      image={social?.profileImage}
      useImageOnError
      className="[&>img]:!w-full"
    />
  );
}
