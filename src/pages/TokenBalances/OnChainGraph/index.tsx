import { useSearchInput } from '../../../hooks/useSearchInput';
import { useState } from 'react';
import { UserInfo } from './UserInfo';
import classNames from 'classnames';
import { Header } from './Header';
import { Loader } from './Loader';
import { filterDuplicatedAndCalculateScore, sortByScore } from './utils';
import { ScoreMap } from './constants';
import { useOnChainGraphData } from './hooks/useOnChainGraphData';
import { OnChainGraphDataContextProvider } from './context/OnChainGraphDataContext';
import { useGetOnChainData } from './hooks/useGetOnChainData';

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
  const [showGridView, setShowGridView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scanning] = useGetOnChainData(identities[0]);

  return (
    <div className="max-w-[950px] mx-auto w-full text-sm pt-10 sm:pt-5">
      <Header
        identities={identities}
        showGridView={showGridView}
        setShowGridView={setShowGridView}
        onApplyScore={(score: ScoreMap) => {
          setData(recommendations => {
            return sortByScore(
              filterDuplicatedAndCalculateScore(recommendations, score)
            );
          });
        }}
      />
      <div
        className={classNames('grid grid-cols-3 gap-12 my-10', {
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
            setData(recommendations => {
              return sortByScore(
                filterDuplicatedAndCalculateScore(recommendations)
              );
            });
            setLoading(false);
          }}
          onCloseLoader={() => {
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
