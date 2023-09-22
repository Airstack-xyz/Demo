import {
  ComponentProps,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useSearchInput } from '../../../../hooks/useSearchInput';
import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { Header } from './Header';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Poap, Token as TokenType, TokensData } from '../../types';
import { filterTokens, getRequestFilters } from './filters';
import { Token } from './Token';
import classNames from 'classnames';
import { StatusLoader } from '../../../../Components/StatusLoader';
import { useLoaderContext } from '../../../../hooks/useLoader';
import { getFilterablePoapsQuery } from '../../../../queries/overviewDetailsPoap';
import {
  getCommonNftOwnersQueryWithFilters,
  getNftOwnersQueryWithFilters
} from '../../../../queries/commonNftOwnersQueryWithFilters';
import { getCommonPoapAndNftOwnersQueryWithFilters } from '../../../../queries/commonPoapAndNftOwnersQueryWithFilters';
import {
  getCommonNftOwnersSnapshotQueryWithFilters,
  getNftOwnersSnapshotQueryWithFilters
} from '../../../../queries/commonNftOwnersSnapshotQueryWithFilters';
import { sortByAddressByNonERC20First } from '../../../../utils/getNFTQueryForTokensHolder';
import { useOverviewTokens } from '../../../../store/tokenHoldersOverview';
import { getPoapList, getTokenList } from './utils';
import { sortAddressByPoapFirst } from '../../../../utils/sortAddressByPoapFirst';
import { getActiveSnapshotInfo } from '../../../../utils/activeSnapshotInfoString';
import { AddressesModal } from '../../../../Components/AddressesModal';
import { createTokenBalancesUrl } from '../../../../utils/createTokenUrl';
import { useNavigate } from 'react-router-dom';

const MAX_LIMIT = 200;
const MIN_LIMIT = 20;

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
    <table className="w-auto text-xs table-fixed sm:w-full">
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

// function sortArray(array: TokenAddress[]) {
//   const startsWith0x: TokenAddress[] = [];
//   const notStartsWith0x: TokenAddress[] = [];

//   for (const item of array) {
//     if (item.address.startsWith('0x')) {
//       startsWith0x.push(item);
//     } else {
//       notStartsWith0x.push(item);
//     }
//   }

//   return [...notStartsWith0x, ...startsWith0x];
// }

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
    total: MAX_LIMIT,
    matching: 0
  });

  const navigate = useNavigate();

  const requestFilters = useMemo(() => {
    return getRequestFilters(filters);
  }, [filters]);

  const snapshotInfo = useMemo(
    () => getActiveSnapshotInfo(activeSnapshotInfo),
    [activeSnapshotInfo]
  );

  const hasSomePoap = tokenAddress.some(token => !token.startsWith('0x'));
  const hasPoap = tokenAddress.every(token => !token.startsWith('0x'));

  const address = useMemo(() => {
    return sortByAddressByNonERC20First(tokenAddress, overviewTokens, hasPoap);
  }, [hasPoap, tokenAddress, overviewTokens]);

  const tokensQuery = useMemo(() => {
    const hasSocialFilters = Boolean(requestFilters?.socialFilters);
    const hasPrimaryDomain = requestFilters?.hasPrimaryDomain;
    if (address.length === 1) {
      if (snapshotInfo.isApplicable) {
        return getNftOwnersSnapshotQueryWithFilters({
          address: address[0].address,
          blockNumber: snapshotInfo.blockNumber,
          date: snapshotInfo.date,
          timestamp: snapshotInfo.timestamp,
          hasSocialFilters: hasSocialFilters,
          hasPrimaryDomain: hasPrimaryDomain
        });
      }
      return getNftOwnersQueryWithFilters(
        address[0].address,
        hasSocialFilters,
        hasPrimaryDomain
      );
    }
    if (hasSomePoap) {
      const tokens = sortAddressByPoapFirst(address);
      return getCommonPoapAndNftOwnersQueryWithFilters(
        tokens[0],
        tokens[1],
        hasSocialFilters,
        hasPrimaryDomain
      );
    }
    if (snapshotInfo.isApplicable) {
      return getCommonNftOwnersSnapshotQueryWithFilters({
        address1: address[0],
        address2: address[1],
        blockNumber: snapshotInfo.blockNumber,
        date: snapshotInfo.date,
        timestamp: snapshotInfo.timestamp,
        hasSocialFilters: hasSocialFilters,
        hasPrimaryDomain: hasPrimaryDomain
      });
    }
    return getCommonNftOwnersQueryWithFilters(
      address[0],
      address[1],
      hasSocialFilters,
      hasPrimaryDomain
    );
  }, [
    requestFilters?.socialFilters,
    requestFilters?.hasPrimaryDomain,
    address,
    hasSomePoap,
    snapshotInfo.isApplicable,
    snapshotInfo.blockNumber,
    snapshotInfo.date,
    snapshotInfo.timestamp
  ]);

  const poapsQuery = useMemo(() => {
    const hasSocialFilters = Boolean(requestFilters?.socialFilters);
    const hasPrimaryDomain = requestFilters?.hasPrimaryDomain;
    return getFilterablePoapsQuery(address, hasSocialFilters, hasPrimaryDomain);
  }, [
    address,
    requestFilters?.hasPrimaryDomain,
    requestFilters?.socialFilters
  ]);

  const shouldFetchTokens = address.length > 0;
  const hasMultipleTokens = address.length > 1;

  const handleData = useCallback(
    (tokensData: TokensData) => {
      if (!tokensData) return;
      const [tokens, size] = hasPoap
        ? getPoapList(tokensData, hasMultipleTokens)
        : getTokenList(tokensData, hasMultipleTokens, hasSomePoap);

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
      setTokens(prev => [...prev, ...filteredTokens]);
    },
    [filters, hasMultipleTokens, hasPoap, hasSomePoap]
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
        total: MAX_LIMIT,
        matching: 0
      });

      if (hasPoap) {
        fetchPoap({
          limit: MAX_LIMIT,
          ...requestFilters
        });
        return;
      }

      if (snapshotInfo.isApplicable) {
        fetchTokens({
          limit: MAX_LIMIT,
          blockNumber: snapshotInfo.blockNumber,
          date: snapshotInfo.date,
          timestamp: snapshotInfo.timestamp,
          ...requestFilters
        });
      } else {
        fetchTokens({
          limit: MAX_LIMIT,
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
    snapshotInfo.isApplicable,
    snapshotInfo.blockNumber,
    snapshotInfo.date,
    snapshotInfo.timestamp
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
    (address: string, type = '') => {
      const isFarcaster = type?.includes('farcaster');
      navigate(
        createTokenBalancesUrl({
          address: isFarcaster ? `fc_fname:${address}` : address,
          blockchain: 'ethereum',
          inputType: 'ADDRESS'
        })
      );
    },
    [navigate]
  );

  const handleNext = useCallback(() => {
    if (!loading && hasNextPage && getNextPage) {
      getNextPage();
    }
  }, [getNextPage, hasNextPage, loading]);

  if (loading && (!tokens || tokens.length === 0)) {
    return (
      <>
        <div className="w-full border-solid-light rounded-2xl sm:overflow-hidden pb-5 overflow-y-auto">
          <Loader />
        </div>
        <StatusLoader
          total={loaderData.total}
          matching={loaderData.matching}
          tokenName={activeViewToken || ''}
        />
      </>
    );
  }

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
        </InfiniteScroll>
      </div>
      <AddressesModal
        heading={`All ${modalData.dataType} names of ${address.join(', ')}`}
        isOpen={modalData.isOpen}
        addresses={modalData.addresses}
        onRequestClose={handleModalClose}
        onAddressClick={handleAddressClick}
      />
      {(loading || loaderData.isVisible) && (
        <StatusLoader
          total={loaderData.total}
          matching={loaderData.matching}
          tokenName={activeViewToken || ''}
        />
      )}
    </>
  );
}

export const OverviewDetailsTokens = memo(TokensComponent);
