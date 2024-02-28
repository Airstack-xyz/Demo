import { useMemo } from 'react';
import ImageWithFallback from '../../../Components/ImageWithFallback';
import { ListWithMoreOptions } from '../../../Components/ListWithMoreOptions';
import { WalletAddress } from '../../../Components/WalletAddress';
import { farcasterImage } from '../constants';
import { ParticipentType } from './types';

function getUserDetails(participent: ParticipentType | null) {
  const userAddress = participent?.participant?.userAddress;
  const userAddressDetails =
    participent?.participant?.userAssociatedAddressDetails;

  const details = userAddressDetails?.filter(
    details => details.identity !== userAddress
  );
  return details?.length ? details[0] : userAddressDetails?.[0];
}

export function Participent({
  participent,
  onShowMoreClick,
  onAddressClick
}: {
  participent: ParticipentType | null;
  onShowMoreClick?: (addresses: string[], dataType?: string) => void;
  onAddressClick?: (address: string, type?: string) => void;
}) {
  const userAddressDetails = getUserDetails(participent);
  const ensNames = useMemo(
    () => userAddressDetails?.domains?.map(domain => domain?.name || '') || [],
    [userAddressDetails?.domains]
  );
  const walletAddress = userAddressDetails?.identity;

  return (
    <>
      <td>
        <span className="flex justify-center">
          <ImageWithFallback
            src={participent?.participant?.coverImageURI}
            fallback={farcasterImage}
            className="rounded-sm overflow-hidden"
          />
        </span>
      </td>
      <td>
        <div className="ellipsis">
          {participent?.participant?.profileName || '--'}
        </div>
      </td>
      <td>{participent?.participant?.fid || '--'}</td>
      <td>{userAddressDetails?.primaryDomain?.name || '--'}</td>
      <td>
        <ListWithMoreOptions
          list={ensNames}
          listFor="ens"
          onShowMore={() => onShowMoreClick?.(ensNames, 'ens')}
          onItemClick={onAddressClick}
        />
      </td>
      <td className="ellipsis max-w-[120px]">
        <WalletAddress
          address={walletAddress}
          className="mb-1"
          onClick={onAddressClick}
        />
      </td>
      <td>
        <span>{participent?.lastActionTimestamp || '--'}</span>
      </td>
    </>
  );
}
