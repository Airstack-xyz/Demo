import { useCallback, useEffect, useRef, useState } from 'react';
import { UserInfo } from './UserInfo';
import classNames from 'classnames';
import { Header } from './Header';
import { Loader } from './Loader';
import { useOnchainGraphContext } from './hooks/useOnchainGraphContext';
import { OnchainGraphContextProvider } from './context/OnchainGraphContext';
import { useGetOnChainData } from './hooks/useGetOnChainData';
import { isMobileDevice } from '../../utils/isMobileDevice';
import { createFormattedRawInput } from '../../utils/createQueryParamsWithMention';
import { useIdentity } from './hooks/useIdentity';
import { createSearchParams } from 'react-router-dom';
import { useNavigate } from '@/hooks/useNavigate';
import { usePaginatedData } from './hooks/usePaginatedData';
import InfiniteScroll from 'react-infinite-scroll-component';
import { OnchainGraphCache, clearCache, getCache, setCache } from './cache';

function ItemsLoader() {
  const loaderItems = Array(6).fill(0);
  return (
    <>
      {loaderItems.map((_, index) => (
        <div key={index} className="skeleton-loader" data-loader-type="block">
          {/* eslint-disable-next-line */}
          <UserInfo identities={{} as any} />
        </div>
      ))}
    </>
  );
}

export function OnChainGraphComponent() {
  const identity = useIdentity();
  const navigate = useNavigate();
  const [recommendations, totalItems, isLastPage, getNextPage] =
    usePaginatedData();
  const {
    data,
    scanIncomplete,
    displayIdentities,
    totalScannedDocuments,
    setData,
    sortDataUsingScore
  } = useOnchainGraphContext();

  const isMobile = isMobileDevice();

  const [showGridView, setShowGridView] = useState(() => !isMobile);
  const [showLoader, setShowLoader] = useState(false);

  const [startScan, scanning, cancelScan] = useGetOnChainData(identity);

  const dataToCachedRef = useRef<OnchainGraphCache>({
    cacheFor: identity,
    data,
    hasCompleteData: scanIncomplete ? false : !scanning,
    totalScannedDocuments
  });

  dataToCachedRef.current.cacheFor = identity;
  dataToCachedRef.current.data = data;
  dataToCachedRef.current.hasCompleteData = scanIncomplete ? false : !scanning;
  dataToCachedRef.current.totalScannedDocuments = totalScannedDocuments;

  useEffect(
    () => () => {
      setCache({ ...dataToCachedRef.current });
    },
    [identity]
  );

  useEffect(() => {
    const data = getCache().data || [];
    if (identity && data?.length === 0) {
      startScan();
      setShowLoader(true);
    } else if (data?.length > 0) {
      setShowLoader(true);
    }
  }, [identity, startScan]);

  useEffect(() => {
    // if no identity, redirect to home page
    if (!identity) {
      navigate('/', {
        replace: true
      });
    }
  }, [identity, navigate]);

  const handleUserClick = useCallback(
    async (_identity: string) => {
      const rawInputForExistingIdentity = createFormattedRawInput({
        label: identity,
        address: identity,
        type: 'ADDRESS',
        blockchain: 'ethereum',
        truncateLabel: isMobile
      });

      const rawInputForNewIdentity = createFormattedRawInput({
        label: _identity,
        address: _identity,
        type: 'ADDRESS',
        blockchain: 'ethereum'
      });
      navigate({
        pathname: '/token-balances',
        search: createSearchParams({
          rawInput: `${rawInputForExistingIdentity} ${rawInputForNewIdentity}`,
          address: `${identity},${_identity}`
        }).toString()
      });
    },
    [identity, isMobile, navigate]
  );

  return (
    <div className="max-w-[958px] px-2 mx-auto w-full text-sm">
      <Header
        loading={scanning}
        identities={[identity]}
        showGridView={showGridView}
        setShowGridView={setShowGridView}
        onApplyScore={sortDataUsingScore}
      />
      <div>
        <InfiniteScroll
          next={getNextPage}
          dataLength={recommendations.length}
          hasMore={!isLastPage}
          className={classNames('grid sm:grid-cols-3 gap-12 my-5 sm:my-10', {
            '!grid-cols-1 [&>div]:w-[600px] [&>div]:max-w-[100%] justify-items-center':
              !showGridView
          })}
          loader={null}
        >
          {recommendations?.map?.((user, index) => (
            <UserInfo
              user={user}
              key={`${index}_${user.addresses?.[0] || user.domains?.[0]}`}
              identities={displayIdentities}
              showDetails={!showGridView}
              loading={scanning}
              onClick={handleUserClick}
            />
          ))}
          {scanning && <ItemsLoader />}
        </InfiniteScroll>
      </div>
      {showLoader && (
        <Loader
          total={totalScannedDocuments}
          matching={totalItems}
          scanCompleted={!scanning}
          onSortByScore={() => {
            setData(recommendations => [...recommendations]);
            setShowLoader(false);
          }}
          onCloseLoader={() => {
            setShowLoader(false);
          }}
          onCancelScan={() => {
            cancelScan();
          }}
          onRestartScan={() => {
            startScan();
            clearCache();
          }}
        />
      )}
    </div>
  );
}

export function OnChainGraph() {
  return (
    <OnchainGraphContextProvider>
      <OnChainGraphComponent />
    </OnchainGraphContextProvider>
  );
}
