import { useMemo } from 'react';
import ImageWithFallback from '../../../Components/ImageWithFallback';
import { ListWithMoreOptions } from '../../../Components/ListWithMoreOptions';
import { WalletAddress } from '../../../Components/WalletAddress';
import { farcasterPlaceholderImage } from '../constants';
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

function Clickable({
  value,
  onClick
}: {
  value: string | null | undefined;
  onClick: () => void;
}) {
  return (
    <div
      className="px-1 py-1 -ml-1 rounded-18 ellipsis max-w-[200px] sm:max-w-none hover:bg-glass-1 cursor-pointer"
      onClick={onClick}
    >
      {value || '--'}
    </div>
  );
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
            fallback={farcasterPlaceholderImage}
            className="rounded-sm overflow-hidden h-[50px] w-[50px]"
          />
        </span>
      </td>
      <td>
        <Clickable
          value={participent?.participant?.profileName}
          onClick={() =>
            onAddressClick?.(
              participent?.participant?.profileName || '',
              'farcaster'
            )
          }
        />
      </td>
      <td>{participent?.participant?.fid || '--'}</td>
      <td>
        <Clickable
          value={userAddressDetails?.primaryDomain?.name}
          onClick={() =>
            onAddressClick?.(userAddressDetails?.primaryDomain?.name || '')
          }
        />
      </td>
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
