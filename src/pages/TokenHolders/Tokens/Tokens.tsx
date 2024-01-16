import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LazyAddressesModal } from '../../../Components/LazyAddressesModal';
import { StatusLoader } from '../../../Components/StatusLoader';
import { useGetCommonOwnersOfPoaps } from '../../../hooks/useGetCommonOwnersOfPoaps';
import { useGetCommonOwnersOfTokens } from '../../../hooks/useGetCommonOwnersOfTokens';
import {
  resetCachedUserInputs,
  useSearchInput
} from '../../../hooks/useSearchInput';
import {
  TokenHolder,
  useOverviewTokens
} from '../../../store/tokenHoldersOverview';
import { formatAddress } from '../../../utils';
import { getActiveSnapshotInfo } from '../../../utils/activeSnapshotInfoString';
import { addToActiveTokenInfo } from '../../../utils/activeTokenInfoString';
import { createTokenBalancesUrl } from '../../../utils/createTokenUrl';
import { sortByAddressByNonERC20First } from '../../../utils/getNFTQueryForTokensHolder';
import { isMobileDevice } from '../../../utils/isMobileDevice';
import { Header } from './Header';
import { AssetType, Token } from './Token';
import { DownloadCSVOverlay } from '../../../Components/DownloadCSVOverlay';

const loaderData = Array(6).fill({});

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
              <Token token={null} isCombination={false} />
            </div>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function TokensComponent() {
  const [{ tokens: _overviewTokens }] = useOverviewTokens(['tokens']);
  const [
    { address, inputType, activeTokenInfo, activeSnapshotInfo },
    setSearchData
  ] = useSearchInput();

  const isMobile = isMobileDevice();

  const overviewTokens: TokenHolder[] = _overviewTokens;

  const shouldFetchPoaps = useMemo(() => {
    const snapshot = getActiveSnapshotInfo(activeSnapshotInfo);
    const hasSomeToken = address.some(a => a.startsWith('0x'));
    // Don't fetch Poaps for snapshot query
    return !hasSomeToken && !snapshot.isApplicable;
  }, [address, activeSnapshotInfo]);

  const hasMultipleERC20 = useMemo(() => {
    const erc20Tokens = overviewTokens.filter(
      (token: TokenHolder) => token.tokenType === 'ERC20'
    );
    return erc20Tokens.length > 1;
  }, [overviewTokens]);

  const tokenAddresses = useMemo(() => {
    return sortByAddressByNonERC20First(
      address,
      overviewTokens,
      shouldFetchPoaps
    );
  }, [shouldFetchPoaps, address, overviewTokens]);

  const {
    fetch: fetchTokens,
    loading: loadingTokens,
    tokens: tokensData,
    processedTokensCount,
    ...paginationTokens
  } = useGetCommonOwnersOfTokens(tokenAddresses);

  const {
    fetch: fetchPoaps,
    loading: loadingPoaps,
    poaps: poapsData,
    processedPoapsCount,
    ...paginationPoaps
  } = useGetCommonOwnersOfPoaps(tokenAddresses);

  const navigate = useNavigate();

  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    dataType: string;
    addresses: string[];
  }>({
    isOpen: false,
    dataType: '',
    addresses: []
  });

  const isPoap = inputType === 'POAP';

  useEffect(() => {
    if (
      tokenAddresses.length === 0 ||
      overviewTokens.length === 0 || // Important: Need to wait for overview tokens to resolved before fetching actual tokens
      hasMultipleERC20
    )
      return;

    if (isPoap && shouldFetchPoaps) {
      fetchPoaps();
      return;
    }

    fetchTokens();
  }, [
    fetchPoaps,
    fetchTokens,
    isPoap,
    shouldFetchPoaps,
    tokenAddresses.length,
    hasMultipleERC20,
    overviewTokens.length
  ]);

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

  const handleAssetClick = useCallback(
    (token: AssetType) => {
      setSearchData(
        {
          activeTokenInfo: addToActiveTokenInfo(token, activeTokenInfo),
          activeSnapshotInfo: ''
        },
        { updateQueryParams: true }
      );
    },
    [activeTokenInfo, setSearchData]
  );

  const { hasNextPage } = shouldFetchPoaps ? paginationPoaps : paginationTokens;

  const loading = overviewTokens.length === 0 || loadingPoaps || loadingTokens;
  const showDownCSVOverlay = hasNextPage && !loading;

  const tokens = shouldFetchPoaps ? poapsData : tokensData;
  const totalProcessed = processedTokensCount + processedPoapsCount;
  const isCombination = address.length > 1;
  const showStatusLoader = loading && isCombination;

  // ERC20 tokens have a large number of holders so we don't allow multiple ERC20 tokens to be searched at once
  if (hasMultipleERC20) return null;

  if (loading && (!tokens || tokens.length === 0)) {
    return (
      <div className="w-full border-solid-light rounded-2xl sm:overflow-hidden pb-5 overflow-y-auto">
        <Loader />
        {showStatusLoader && (
          <StatusLoader total={totalProcessed} matching={tokens.length} />
        )}
      </div>
    );
  }

  const isERC20 = tokens && tokens[0]?.tokenType === 'ERC20';

  return (
    <div className="relative mb-5">
      {showDownCSVOverlay && <DownloadCSVOverlay />}
      <div className="w-full border-solid-light rounded-2xl sm:overflow-hidden pb-5 overflow-y-auto">
        <table className="w-auto text-xs table-fixed sm:w-full select-none">
          <Header isERC20={isERC20} isCombination={isCombination} />
          <tbody>
            {tokens.map((token, index) => (
              <tr
                key={index}
                className="[&>td]:px-2 [&>td]:py-3 [&>td]:align-middle min-h-[54px]"
                data-loader-type="block"
                data-loader-margin="10"
              >
                <Token
                  token={token}
                  isCombination={isCombination}
                  onShowMoreClick={handleShowMoreClick}
                  onAddressClick={handleAddressClick}
                  onAssetClick={handleAssetClick}
                />
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && tokens.length === 0 && (
          <div className="flex flex-1 justify-center text-xs font-semibold mt-5">
            No data found!
          </div>
        )}
        {loading && <Loader />}
      </div>
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
      {showStatusLoader && (
        <StatusLoader total={totalProcessed} matching={tokens.length} />
      )}
    </div>
  );
}

export const Tokens = memo(TokensComponent);
