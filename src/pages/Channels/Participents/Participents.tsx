import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import {
  FarcasterChannelParticipantsQuery,
  FarcasterChannelParticipantsQueryVariables,
  OrderBy
} from '../../../../__generated__/airstack-types';
import { farcasterParticipentsQuery } from '../../../queries/channels';
import { memo, useCallback, useEffect, useState } from 'react';
import { createTokenBalancesUrl } from '../../../utils/createTokenUrl';
import { formatAddress } from '../../../utils';
import { resetCachedUserInputs } from '../../../hooks/useSearchInput';
import { useNavigate } from 'react-router-dom';
import { isMobileDevice } from '../../../utils/isMobileDevice';
import { LazyAddressesModal } from '../../../Components/LazyAddressesModal';
import { Header } from './Header';
import { Participent } from './Participent';
import { DownloadCSVOverlay } from '../../../Components/DownloadCSVOverlay';
import { useResolveUserDetails } from './resolveUserDetails';

const loaderData = Array(6).fill({});
const LIMIT = 30;

function Loader() {
  return (
    <table className="text-xs table-fixed w-full">
      <tbody>
        {loaderData.map((_, index) => (
          <tr
            key={index}
            className="[&>div>td]:px-2 [&>div>td]:py-3 [&>div>td]:align-middle min-h-[54px] hover:bg-glass cursor-pointer skeleton-loader [&>div>td:last-child]:hidden"
          >
            <div data-loader-type="block" data-loader-margin="10">
              <Participent participent={null} />
            </div>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Participents({
  channelId,
  orderBy
}: {
  channelId: string;
  orderBy: OrderBy;
}) {
  const { resolve, resolved, loading: resolving } = useResolveUserDetails();
  const [
    fetchParticipents,
    {
      loading: loadingParticipents,
      pagination: { hasNextPage }
    }
  ] = useLazyQueryWithPagination<
    FarcasterChannelParticipantsQuery,
    FarcasterChannelParticipantsQueryVariables
  >(farcasterParticipentsQuery, undefined, {
    onCompleted(data) {
      if (data) {
        resolve(
          data.FarcasterChannelParticipants?.FarcasterChannelParticipant || []
        );
      }
    }
  });

  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    dataType: string;
    addresses: string[];
  }>({
    isOpen: false,
    dataType: '',
    addresses: []
  });

  const isMobile = isMobileDevice();
  const navigate = useNavigate();

  const handleShowMoreClick = useCallback(
    (addresses: string[], type?: string) => {
      setModalData({
        isOpen: true,
        dataType: type || 'ens',
        addresses
      });
    },
    []
  );

  const handleModalClose = () => {
    setModalData({
      isOpen: false,
      dataType: '',
      addresses: []
    });
  };

  const handleAddressClick = useCallback(
    (address: string, type?: string) => {
      const url = createTokenBalancesUrl({
        address: formatAddress(address, type),
        blockchain: 'ethereum',
        inputType: 'ADDRESS',
        truncateLabel: isMobile
      });
      document.documentElement.scrollTo(0, 0);
      resetCachedUserInputs('tokenBalance');
      navigate(url);
    },
    [isMobile, navigate]
  );

  useEffect(() => {
    if (channelId) {
      fetchParticipents({
        channelId,
        limit: LIMIT,
        orderBy: orderBy
      });
    }
  }, [channelId, fetchParticipents, orderBy]);

  const participents = resolved || [];

  const loading = loadingParticipents || resolving;
  const showDownCSVOverlay = hasNextPage && !loading;

  return (
    <div className="relative mb-5">
      <div className="w-full border-solid-light rounded-2xl sm:overflow-hidden pb-5 overflow-y-auto">
        <table className="w-auto text-xs table-fixed sm:w-full select-none">
          <Header />
          <tbody>
            {participents.map((token, index) => (
              <tr
                key={index}
                className="[&>td]:px-2 [&>td]:py-3 [&>td]:align-middle min-h-[54px]"
                data-loader-type="block"
                data-loader-margin="10"
              >
                <Participent
                  participent={token}
                  onShowMoreClick={handleShowMoreClick}
                  onAddressClick={handleAddressClick}
                  // onAssetClick={handleAssetClick}
                />
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && participents.length === 0 && (
          <div className="flex flex-1 justify-center text-xs font-semibold mt-5">
            No data found!
          </div>
        )}
        {loading && <Loader />}
        {modalData.isOpen && (
          <LazyAddressesModal
            heading={`All ${modalData.dataType} names of ${modalData.addresses[0]}`}
            isOpen={modalData.isOpen}
            dataType={modalData.dataType}
            addresses={modalData.addresses}
            onRequestClose={handleModalClose}
            onAddressClick={handleAddressClick}
          />
        )}
        {showDownCSVOverlay && (
          <DownloadCSVOverlay className="!relative -mb-5" />
        )}
      </div>
    </div>
  );
}

export const ParticipentsList = memo(Participents);
