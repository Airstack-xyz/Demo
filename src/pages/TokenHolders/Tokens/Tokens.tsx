import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  resetCachedUserInputs,
  useSearchInput
} from '../../../hooks/useSearchInput';
import { Header } from './Header';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AssetType, Token } from './Token';
import { AddressesModal } from '../../../Components/AddressesModal';
import { createTokenBalancesUrl } from '../../../utils/createTokenUrl';
import { useGetCommonOwnersOfTokens } from '../../../hooks/useGetCommonOwnersOfTokens';
import { useGetCommonOwnersOfPoaps } from '../../../hooks/useGetCommonOwnersOfPoaps';
import { StatusLoader } from '../../../Components/StatusLoader';
import {
  TokenHolder,
  useOverviewTokens
} from '../../../store/tokenHoldersOverview';
import { sortByAddressByNonERC20First } from '../../../utils/getNFTQueryForTokensHolder';
import { getActiveSnapshotInfo } from '../../../utils/activeSnapshotInfoString';
import { addToActiveTokenInfo } from '../../../utils/activeTokenInfoString';

const loaderData = Array(6).fill({});

function Loader() {
  return (
    <table className="w-auto text-xs table-fixed sm:w-full">
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

  const tokenAddress = useMemo(() => {
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
  } = useGetCommonOwnersOfTokens(tokenAddress);

  const {
    fetch: fetchPoap,
    loading: loadingPoaps,
    poaps,
    processedPoapsCount,
    ...paginationPoaps
  } = useGetCommonOwnersOfPoaps(tokenAddress);

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
    if (tokenAddress.length === 0 || hasMultipleERC20) return;

    if (isPoap && shouldFetchPoaps) {
      fetchPoap();
      return;
    }

    fetchTokens();
  }, [
    fetchPoap,
    fetchTokens,
    isPoap,
    shouldFetchPoaps,
    tokenAddress.length,
    hasMultipleERC20
  ]);

  const handleShowMoreClick = useCallback((values: string[], type?: string) => {
    setModalData({
      isOpen: true,
      dataType: type || 'ens',
      addresses: values
    });
  }, []);

  const handleModalClose = () => {
    setModalData({
      isOpen: false,
      dataType: '',
      addresses: []
    });
  };

  const handleAddressClick = useCallback(
    (address: string, type?: string) => {
      const isFarcaster = type?.includes('farcaster');
      const url = createTokenBalancesUrl({
        address: isFarcaster ? `fc_fname:${address}` : address,
        blockchain: 'ethereum',
        inputType: 'ADDRESS'
      });
      resetCachedUserInputs('tokenBalance');
      navigate(url);
    },
    [navigate]
  );

  const handleAssetClick = useCallback(
    (token: AssetType) => {
      setSearchData(
        {
          activeTokenInfo: addToActiveTokenInfo(token, activeTokenInfo)
        },
        { updateQueryParams: true }
      );
    },
    [activeTokenInfo, setSearchData]
  );

  const { hasNextPage, getNextPage } = shouldFetchPoaps
    ? paginationPoaps
    : paginationTokens;

  const loading = overviewTokens.length === 0 || loadingPoaps || loadingTokens;

  const handleNext = useCallback(() => {
    if (!loading && hasNextPage && getNextPage) {
      getNextPage();
    }
  }, [getNextPage, hasNextPage, loading]);

  const tokens = shouldFetchPoaps ? poaps : tokensData;
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
    <>
      <div className="w-full border-solid-light rounded-2xl sm:overflow-hidden pb-5 overflow-y-auto mb-5">
        <InfiniteScroll
          next={handleNext}
          dataLength={tokens.length}
          hasMore={hasNextPage}
          loader={null}
        >
          <table className="w-auto text-xs table-fixed sm:w-full">
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
        </InfiniteScroll>
        {loading && <Loader />}
      </div>
      <AddressesModal
        heading={`All ${modalData.dataType} names of ${address}`}
        isOpen={modalData.isOpen}
        addresses={modalData.addresses}
        onRequestClose={handleModalClose}
        onAddressClick={handleAddressClick}
      />
      {showStatusLoader && (
        <StatusLoader total={totalProcessed} matching={tokens.length} />
      )}
    </>
  );
}

export const Tokens = memo(TokensComponent);
