import { Chain } from '@airstack/airstack-react/constants';
import { Asset } from '../../../../Components/Asset';
import { Domain, Social } from '../../../TokenBalances/types';

export function Profile({
  social,
  domain
}: {
  social: Social | null;
  domain: Domain | null;
}) {
  const hasDomainToken = domain?.tokenNft;

  let blockchain = hasDomainToken
    ? domain?.tokenNft?.blockchain
    : social?.blockchain;

  if (blockchain !== 'ethereum' && blockchain !== 'polygon') {
    blockchain = '';
  }

  const profileImageUrl = social?.profileImageContentValue?.image?.small;

  const tokenId = hasDomainToken
    ? domain?.tokenNft?.tokenId
    : social?.profileTokenId;

  const tokenAddress = hasDomainToken
    ? domain?.tokenNft?.address
    : social?.profileTokenAddress;

  return (
    <Asset
      preset="medium"
      containerClassName="w-full h-full flex items-center justify-center"
      chain={blockchain as Chain}
      tokenId={blockchain ? tokenId || '' : ''}
      address={
        // if there is profile image then set address to empty string so that it doesn't show the token image
        profileImageUrl ? '' : tokenAddress || ''
      }
      image={profileImageUrl}
      useImageOnError
      className="[&>img]:!w-full"
    />
  );
}
