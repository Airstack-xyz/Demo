import { useMemo } from 'react';
import { FarcasterChannelParticipantsQuery } from '../../../../__generated__/airstack-types';
import ImageWithFallback from '../../../Components/ImageWithFallback';
import { ListWithMoreOptions } from '../../../Components/ListWithMoreOptions';
import { WalletAddress } from '../../../Components/WalletAddress';
import { farcasterImage } from '../constants';

type ParticipentType = NonNullable<
  NonNullable<
    FarcasterChannelParticipantsQuery['FarcasterChannelParticipants']
  >['FarcasterChannelParticipant']
>[0];
export function Participent({
  participent,
  onShowMoreClick,
  onAddressClick
}: {
  participent: ParticipentType | null;
  onShowMoreClick?: (addresses: string[], dataType?: string) => void;
  onAddressClick?: (address: string, type?: string) => void;
  // onAssetClick?: (asset: AssetType) => void;
}) {
  const userAddressDetails = participent?.participant?.userAddressDetails;
  const ensNames = useMemo(
    () => userAddressDetails?.domains?.map(domain => domain?.name || '') || [],
    [userAddressDetails?.domains]
  );

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
          {participent?.participant?.fnames || '--'}
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
          address={participent?.participant?.userAddress}
          onClick={onAddressClick}
        />
      </td>
      <td>
        <span>{participent?.lastActionTimestamp || '--'}</span>
      </td>
    </>
  );
}
