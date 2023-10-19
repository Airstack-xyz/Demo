import { useSearchInput } from '../../../hooks/useSearchInput';
import { useQueryWithPagination } from '@airstack/airstack-react';
import { getOnChainGraphQuery } from '../../../queries/onChainGraphQuery';
import { NFTAndPoapResponse, RecommendedUser } from './types';
import { useEffect, useState } from 'react';
import { fetchNftAndTokens, formatNftAndPoapData } from './fetchNftAndPoaps';
import { UserInfo } from './UserInfo';
import classNames from 'classnames';
import { Header } from './Header';
import { Loader } from './Loader';
import { tokenTransferQuery } from '../../../queries/onChainGraph/tokenTransfer';
import { filterDuplicatedAndCalculateScore, sortByScore } from './utils';
import { formatOnChainData, formatTokenTransfer } from './dataFormatter';
import { ScoreMap } from './constants';

const checkXMTP = false;

const onChainQueryLimit = 200 * 7;
const nftAndPoapsLimit = 200 * 3;

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

export function OnChainGraph() {
  const [scanningCount, setScanningCount] = useState<number>(onChainQueryLimit);
  const [showGridView, setShowGridView] = useState(true);
  const [{ address: identities }] = useSearchInput();
  const [recommendations, setRecommendations] = useState<RecommendedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(true);

  const { data, pagination } = useQueryWithPagination(
    getOnChainGraphQuery({
      ethereumTokenTransfers: false,
      polygonTokenTransfers: false
    }),
    {
      user: identities[0]
    },
    {
      dataFormatter: formatOnChainData,
      onCompleted({ data }) {
        setRecommendations(exitingUsers => {
          return filterDuplicatedAndCalculateScore(
            formatOnChainData(data, exitingUsers).recommendedUsers
          );
        });
      }
    }
  );

  const { pagination: tokenTransferPagination } = useQueryWithPagination(
    tokenTransferQuery,
    {
      user: identities[0]
    },
    {
      onCompleted(data) {
        setRecommendations(exitingUsers => {
          return filterDuplicatedAndCalculateScore(
            formatTokenTransfer(data, exitingUsers)
          );
        });
      }
    }
  );

  const { poaps, nfts } = data ?? {};
  const { hasNextPage, getNextPage } = pagination;
  const { hasNextPage: hasNextTokenPage, getNextPage: getNextTokenPage } =
    tokenTransferPagination;

  useEffect(() => {
    if (!poaps || !nfts) return;
    setLoading(true);

    setScanningCount(scanningCount => scanningCount + nftAndPoapsLimit);
    fetchNftAndTokens(
      { poaps, nfts },
      undefined,
      (_data: NFTAndPoapResponse) => {
        setRecommendations(recommendations => {
          const data = formatNftAndPoapData(_data, []);
          for (const res of data) {
            const { addresses = [], xmtp, nfts = [], poaps = [] } = res ?? {};
            if (!checkXMTP || xmtp?.length) {
              const existingUserIndex = recommendations.findIndex(
                ({ addresses: recommendedUsersAddresses }) =>
                  recommendedUsersAddresses?.some?.(address =>
                    addresses?.includes?.(address)
                  )
              );
              if (existingUserIndex !== -1) {
                const _addresses =
                  recommendations?.[existingUserIndex]?.addresses || [];
                recommendations[existingUserIndex].addresses = [
                  ..._addresses,
                  ...addresses
                ]?.filter(
                  (address, index, array) => array.indexOf(address) === index
                );
                const _nfts = recommendations?.[existingUserIndex]?.nfts ?? [];
                recommendations[existingUserIndex].nfts = [..._nfts, ...nfts];
                recommendations[existingUserIndex].poaps = [
                  ...(recommendations?.[existingUserIndex]?.poaps ?? []),
                  ...poaps
                ];
              } else {
                recommendations.push(res);
              }
            }
          }
          return filterDuplicatedAndCalculateScore(recommendations);
        });
      }
    ).then(() => {
      const stopScanning = !hasNextPage && !hasNextTokenPage;
      if (stopScanning) {
        setScanning(false);
        return;
      }
      if (hasNextPage) {
        getNextPage();
      }
      if (hasNextTokenPage) {
        getNextTokenPage();
      }
    });
  }, [
    getNextPage,
    getNextTokenPage,
    hasNextPage,
    hasNextTokenPage,
    identities,
    nfts,
    poaps
  ]);

  return (
    <div className="max-w-[950px] mx-auto w-full text-sm pt-10 sm:pt-5">
      <Header
        identities={identities}
        showGridView={showGridView}
        setShowGridView={setShowGridView}
        onApplyScore={(score: ScoreMap) => {
          setRecommendations(recommendations => {
            return sortByScore(
              filterDuplicatedAndCalculateScore(recommendations, score)
            );
          });
        }}
      />
      <div
        className={classNames('grid grid-cols-3 gap-12 my-10 skeleton-loader', {
          '!grid-cols-1 [&>div]:w-[600px] [&>div]:max-w-[100%] justify-items-center':
            !showGridView
        })}
      >
        {recommendations?.map?.((user, index) => (
          <UserInfo
            user={user}
            key={`${index}_${user.addresses?.[0] || user.domains?.[0]}`}
            identity={identities[0]}
            showDetails={!showGridView}
          />
        ))}
        {scanning && <ItemsLoader />}
      </div>
      {loading && (
        <Loader
          total={scanningCount}
          matching={recommendations.length}
          scanCompleted={!scanning}
          onSortByScore={() => {
            setRecommendations(recommendations => {
              return sortByScore(recommendations);
            });
            setLoading(false);
          }}
        />
      )}
    </div>
  );
}
