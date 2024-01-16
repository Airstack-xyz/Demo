import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import classNames from 'classnames';
import {
  ComponentProps,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useNavigate } from 'react-router-dom';
import { LazyAddressesModal } from '../../../../Components/LazyAddressesModal';
import { StatusLoader } from '../../../../Components/StatusLoader';
import { useLoaderContext } from '../../../../hooks/useLoader';
import {
  resetCachedUserInputs,
  useSearchInput
} from '../../../../hooks/useSearchInput';
import {
  getCommonNftOwnersSnapshotQueryWithFilters,
  getNftOwnersSnapshotQueryWithFilters
} from '../../../../queries/Snapshots/commonNftOwnersSnapshotQueryWithFilters';
import {
  getCommonNftOwnersQueryWithFilters,
  getNftOwnersQueryWithFilters
} from '../../../../queries/commonNftOwnersQueryWithFilters';
import { getCommonPoapAndNftOwnersQueryWithFilters } from '../../../../queries/commonPoapAndNftOwnersQueryWithFilters';
import { getFilterablePoapsQuery } from '../../../../queries/overviewDetailsPoap';
import { useOverviewTokens } from '../../../../store/tokenHoldersOverview';
import { formatAddress } from '../../../../utils';
import {
  getActiveSnapshotInfo,
  getSnapshotQueryFilters
} from '../../../../utils/activeSnapshotInfoString';
import { createTokenBalancesUrl } from '../../../../utils/createTokenUrl';
import { sortByAddressByNonERC20First } from '../../../../utils/getNFTQueryForTokensHolder';
import { isMobileDevice } from '../../../../utils/isMobileDevice';
import { sortAddressByPoapFirst } from '../../../../utils/sortAddressByPoapFirst';
import { Poap, Token as TokenType, TokensData } from '../../types';
import { Header } from './Header';
import { Token } from './Token';
import {
  filterTokens,
  getPoapList,
  getRequestFilters,
  getTokenList
} from './utils';
import { DownloadCSVOverlay } from '../../../../Components/DownloadCSVOverlay';

const LIMIT = 34;
const MIN_LIMIT = 34;

const loaderData = Array(6).fill({});

type TableRowProps = ComponentProps<'tr'> & {
  isLoader?: boolean;
};

type ModalData = {
  isOpen: boolean;
  dataType?: string;
  addresses: string[];
};

function TableRow({ isLoader, children, ...props }: TableRowProps) {
  return (
    <tr
      className={classNames(
        '[&>td]:px-8 [&>td]:py-5 [&>td]:align-middle min-h-[54px]',
        {
          'skeleton-loader [&>td:last-child]:hidden': isLoader,
          '[&>div>td]:px-8 [&>div>td]:py-5': isLoader
        }
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

function Loader() {
  return (
    <table className="text-xs table-fixed w-full">
      <tbody>
        {loaderData.map((_, index) => (
          <TableRow isLoader={true} key={index}>
            <div data-loader-type="block" data-loader-margin="10">
              <Token token={null} />
            </div>
          </TableRow>
        ))}
      </tbody>
    </table>
  );
}

export function TokensComponent() {
  const ownersSetRef = useRef<Set<string>>(new Set());
  const [tokens, setTokens] = useState<(TokenType | Poap)[]>([]);
  const tokensRef = useRef<(TokenType | Poap)[]>([]);
  const [{ tokens: overviewTokens }] = useOverviewTokens(['tokens']);
  const [
    {
      tokenFilters: filters,
      address: tokenAddress,
      activeViewToken,
      activeSnapshotInfo
    }
  ] = useSearchInput();
  const [modalData, setModalData] = useState<ModalData>({
    isOpen: false,
    dataType: '',
    addresses: []
  });
  const [loaderData, setLoaderData] = useState({
    isVisible: false,
    total: LIMIT,
    matching: 0
  });

  const navigate = useNavigate();

  const isMobile = isMobileDevice();

  const requestFilters = useMemo(() => {
    return getRequestFilters(filters);
  }, [filters]);

  const snapshotInfo = useMemo(
    () => getActiveSnapshotInfo(activeSnapshotInfo),
    [activeSnapshotInfo]
  );

  const hasSomePoap = tokenAddress.some(token => !token.startsWith('0x'));
  const hasPoap = tokenAddress.every(token => !token.startsWith('0x'));

  const addresses = useMemo(() => {
    return sortByAddressByNonERC20First(tokenAddress, overviewTokens, hasPoap);
  }, [hasPoap, tokenAddress, overviewTokens]);

  const tokensQuery = useMemo(() => {
    if (addresses.length === 1) {
      if (snapshotInfo.isApplicable) {
        return getNftOwnersSnapshotQueryWithFilters({
          token: addresses[0],
          snapshotFilter: snapshotInfo.appliedFilter,
          ...requestFilters
        });
      }
      return getNftOwnersQueryWithFilters({
        token: addresses[0],
        ...requestFilters
      });
    }
    if (hasSomePoap) {
      const tokens = sortAddressByPoapFirst(addresses);
      return getCommonPoapAndNftOwnersQueryWithFilters({
        poap: tokens[0],
        token: tokens[1],
        ...requestFilters
      });
    }
    if (snapshotInfo.isApplicable) {
      return getCommonNftOwnersSnapshotQueryWithFilters({
        token1: addresses[0],
        token2: addresses[1],
        snapshotFilter: snapshotInfo.appliedFilter,
        ...requestFilters
      });
    }
    return getCommonNftOwnersQueryWithFilters({
      token1: addresses[0],
      token2: addresses[1],
      ...requestFilters
    });
  }, [
    requestFilters,
    addresses,
    hasSomePoap,
    snapshotInfo.isApplicable,
    snapshotInfo.appliedFilter
  ]);

  const poapsQuery = useMemo(() => {
    return getFilterablePoapsQuery({
      tokens: addresses,
      ...requestFilters
    });
  }, [addresses, requestFilters]);

  const shouldFetchTokens = addresses.length > 0;
  const hasMultipleTokens = addresses.length > 1;

  const handleData = useCallback(
    (tokensData: TokensData) => {
      if (!tokensData) return;
      const [tokens, size] = hasPoap
        ? getPoapList({ tokensData, hasMultipleTokens })
        : getTokenList({
            tokensData,
            hasMultipleTokens,
            hasSomePoap,
            isSnapshotApplicable: snapshotInfo.isApplicable
          });

      const filteredTokens = filterTokens(filters, tokens).filter(token => {
        const address = token?.owner?.identity;
        if (!address) return false;
        if (ownersSetRef.current.has(address)) return false;
        ownersSetRef.current.add(address);
        return true;
      });

      tokensRef.current = [...tokensRef.current, ...filteredTokens];

      setLoaderData(prev => ({
        ...prev,
        total: prev.total + (size || 0),
        matching: prev.matching + filteredTokens.length
      }));
      setTokens(prev => [...prev, ...filteredTokens].splice(0, LIMIT));
    },
    [
      filters,
      hasMultipleTokens,
      hasPoap,
      hasSomePoap,
      snapshotInfo.isApplicable
    ]
  );

  const [
    fetchTokens,
    { data, loading: loadingTokens, pagination: paginationTokens }
  ] = useLazyQueryWithPagination(
    tokensQuery,
    {},
    {
      onCompleted: handleData
    }
  );

  const [
    fetchPoap,
    { data: poapsData, loading: loadingPoaps, pagination: paginationPoaps }
  ] = useLazyQueryWithPagination(
    poapsQuery,
    {},
    {
      onCompleted: handleData
    }
  );

  // save data to tokensData and user if further so, if we apply filter we can set this to null,
  // and fetch next data call will not be made
  let tokensData = data || poapsData || null;

  useEffect(() => {
    if (shouldFetchTokens) {
      // eslint-disable-next-line
      tokensData = null;
      tokensRef.current = [];
      ownersSetRef.current = new Set();
      setTokens([]);
      setLoaderData({
        isVisible: true,
        total: LIMIT,
        matching: 0
      });

      if (hasPoap) {
        fetchPoap({
          limit: LIMIT,
          ...requestFilters
        });
        return;
      }

      if (snapshotInfo.isApplicable) {
        const queryFilters = getSnapshotQueryFilters(snapshotInfo);
        fetchTokens({
          limit: LIMIT,
          ...queryFilters,
          ...requestFilters
        });
      } else {
        fetchTokens({
          limit: LIMIT,
          ...requestFilters
        });
      }
    }
  }, [
    fetchPoap,
    fetchTokens,
    filters,
    hasPoap,
    requestFilters,
    shouldFetchTokens,
    snapshotInfo
  ]);

  const { hasNextPage, getNextPage } = hasPoap
    ? paginationPoaps
    : paginationTokens;

  const loading = overviewTokens.length === 0 || loadingPoaps || loadingTokens;
  const loaderContext = useLoaderContext();

  useEffect(() => {
    loaderContext.setIsLoading(loading);
  }, [loaderContext, loading]);

  useEffect(() => {
    if (!tokensData || loading) return;

    if (tokensRef.current.length < MIN_LIMIT && hasNextPage) {
      getNextPage();
    } else {
      tokensRef.current = [];
      setLoaderData(prev => ({ ...prev, isVisible: false }));
    }
  }, [tokensData, loading, hasNextPage, getNextPage]);

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
    (address: string, type = '') => {
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

  const showDownCSVOverlay = hasNextPage && !loading;

  if (loading && (!tokens || tokens.length === 0)) {
    return (
      <>
        <div className="w-full border-solid-light rounded-2xl sm:overflow-hidden pb-5 overflow-y-auto">
          <Loader />
        </div>
        <StatusLoader
          lines={[
            [`Scanning %n ${activeViewToken}`, loaderData.total],
            [`Found %n matching results`, loaderData.matching]
          ]}
        />
      </>
    );
  }

  return (
    <div className="relative  mb-5">
      {showDownCSVOverlay && <DownloadCSVOverlay />}
      <div className="w-full border-solid-light rounded-2xl sm:overflow-hidden pb-5 overflow-y-auto">
        <table className="w-auto text-xs table-fixed sm:w-full select-none">
          <Header />
          <tbody>
            {tokens.map((token, index) => (
              <TableRow key={index}>
                <Token
                  token={token}
                  onShowMoreClick={handleShowMoreClick}
                  onAddressClick={handleAddressClick}
                />
              </TableRow>
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
      {(loading || loaderData.isVisible) && (
        <StatusLoader
          lines={[
            [`Scanning %n ${activeViewToken}`, loaderData.total],
            [`Found %n matching results`, loaderData.matching]
          ]}
        />
      )}
    </div>
  );
}

export const OverviewDetailsTokens = memo(TokensComponent);
