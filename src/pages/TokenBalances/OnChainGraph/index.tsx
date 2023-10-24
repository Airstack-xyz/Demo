import { useCallback, useState } from 'react';
import { useSearchInput } from '../../../hooks/useSearchInput';
import { UserInfo } from './UserInfo';
import classNames from 'classnames';
import { Header } from './Header';
import { Loader } from './Loader';
import { useOnChainGraphData } from './hooks/useOnChainGraphData';
import { OnChainGraphDataContextProvider } from './context/OnChainGraphDataContext';
import { useGetOnChainData } from './hooks/useGetOnChainData';
import { isMobileDevice } from '../../../utils/isMobileDevice';

function ItemsLoader() {
  const loaderItems = Array(6).fill(0);
  return (
    <>
      {loaderItems.map((_, index) => (
        <div data-loader-type="block">
          <UserInfo key={index} />
        </div>
      ))}
    </>
  );
}

export function OnChainGraphComponent() {
  const [{ address: identities }] = useSearchInput();
  const {
    data: recommendations,
    totalScannedDocuments,
    setData
  } = useOnChainGraphData();
  const [showGridView, setShowGridView] = useState(() => !isMobileDevice());
  const [loading, setLoading] = useState(true);
  const [scanning, cancelScan] = useGetOnChainData(identities[0]);

  const applyScore = useCallback(() => {
    setData(recommendations => [...recommendations]);
  }, [setData]);

  return (
    <div className="max-w-[958px] px-2 mx-auto w-full text-sm pt-10 sm:pt-5">
      <Header
        loading={loading}
        identities={identities}
        showGridView={showGridView}
        setShowGridView={setShowGridView}
        onApplyScore={applyScore}
      />
      <div
        className={classNames('grid sm:grid-cols-3 gap-12 my-10', {
          '!grid-cols-1 [&>div]:w-[600px] [&>div]:max-w-[100%] justify-items-center':
            !showGridView,
          'skeleton-loader': scanning
        })}
      >
        {recommendations?.map?.((user, index) => (
          <UserInfo
            user={user}
            key={`${index}_${user.addresses?.[0] || user.domains?.[0]}`}
            identity={identities[0]}
            showDetails={!showGridView}
            loading={scanning}
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
    <OnChainGraphDataContextProvider>
      <OnChainGraphComponent />
    </OnChainGraphDataContextProvider>
  );
}
