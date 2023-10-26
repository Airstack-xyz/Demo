import { useCallback, useEffect, useState } from 'react';
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
import { createSearchParams, useNavigate } from 'react-router-dom';

function ItemsLoader() {
  const loaderItems = Array(6).fill(0);
  return (
    <>
      {loaderItems.map((_, index) => (
        <div className="skeleton-loader" data-loader-type="block">
          <UserInfo key={index} />
        </div>
      ))}
    </>
  );
}

export function OnChainGraphComponent() {
  const identity = useIdentity();
  const navigate = useNavigate();
  // const [{ address: identities, rawInput }, setSearchData] = useSearchInput();
  const {
    data: recommendations,
    totalScannedDocuments,
    setData
  } = useOnchainGraphContext();
  const [showGridView, setShowGridView] = useState(() => !isMobileDevice());
  const [loading, setLoading] = useState(true);
  const [scanning, cancelScan] = useGetOnChainData(identity);

  useEffect(() => {
    // if no identity, redirect to home page
    if (!identity) {
      navigate('/', {
        replace: true
      });
    }
  }, [identity, navigate]);

  const applyScore = useCallback(() => {
    setData(recommendations => [...recommendations]);
  }, [setData]);

  const handleUserClick = useCallback(
    async (_identity: string) => {
      const rawInputForExistingIdentity = createFormattedRawInput({
        label: identity,
        address: identity,
        type: 'ADDRESS',
        blockchain: 'ethereum'
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
    [identity, navigate]
  );

  return (
    <div className="max-w-[958px] px-2 mx-auto w-full text-sm pt-10 sm:pt-5">
      <Header
        loading={scanning}
        identities={[identity]}
        showGridView={showGridView}
        setShowGridView={setShowGridView}
        onApplyScore={applyScore}
      />
      <div
        className={classNames('grid sm:grid-cols-3 gap-12 my-5 sm:my-10', {
          '!grid-cols-1 [&>div]:w-[600px] [&>div]:max-w-[100%] justify-items-center':
            !showGridView
        })}
      >
        {recommendations?.map?.((user, index) => (
          <UserInfo
            user={user}
            key={`${index}_${user.addresses?.[0] || user.domains?.[0]}`}
            identity={identity}
            showDetails={!showGridView}
            loading={scanning}
            onClick={handleUserClick}
          />
        ))}
        {scanning && <ItemsLoader />}
      </div>
      {loading && (
        <Loader
          total={totalScannedDocuments}
          matching={recommendations.length}
          scanCompleted={!scanning}
          onSortByScore={() => {
            setData(recommendations => [...recommendations]);
            setLoading(false);
          }}
          onCloseLoader={() => {
            setLoading(false);
          }}
          onCancelScan={() => {
            cancelScan();
            setLoading(false);
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
