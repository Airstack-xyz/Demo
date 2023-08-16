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
import { Modal } from '../../../../Components/Modal';
import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { Header } from './Header';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Poap, PoapsData, Token as TokenType, TokensData } from '../../types';
import {
  filterTokens,
  getRequestFilters,
  removeDuplicateOwners
} from './filters';
import { getFilterableTokensQuery } from '../../../../queries/overviewDetailsTokens';
import { Token } from './Token';
import classNames from 'classnames';
import { StatusLoader } from './StatusLoader';
import { useLoaderContext } from '../../../../hooks/useLoader';
import { getFilterablePoapsQuery } from '../../../../queries/overviewDetailsPoap';

const LIMIT = 50;

const loaderData = Array(6).fill({});

type TableRowProps = ComponentProps<'tr'> & {
  isLoader?: boolean;
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

export function TokensComponent() {
  const [tokens, setTokens] = useState<(TokenType | Poap)[]>([]);
  const tokensRef = useRef<(TokenType | Poap)[]>([]);
  const [{ tokenFilters: filters, address, inputType }] = useSearchInput();
  const [showStatusLoader, setShowStatusLoader] = useState(false);
  const [loaderStats, setLoaderStats] = useState({
    total: LIMIT,
    matching: 0
  });

  const requestFilters = useMemo(() => {
    return getRequestFilters(filters);
  }, [filters]);

  const { tokensQuery, poapsQuery } = useMemo(() => {
    const tokensQuery = getFilterableTokensQuery(
      address,
      Boolean(requestFilters?.socialFilters),
      requestFilters?.hasPrimaryDomain
    );
    const poapsQuery = getFilterablePoapsQuery(
      address,
      Boolean(requestFilters?.socialFilters),
      requestFilters?.hasPrimaryDomain
    );
    return {
      tokensQuery,
      poapsQuery
    };
  }, [
    address,
    requestFilters?.hasPrimaryDomain,
    requestFilters?.socialFilters
  ]);

  const [
    fetchTokens,
    { data, loading: loadingTokens, pagination: paginationTokens }
  ] = useLazyQueryWithPagination(tokensQuery);

  const [
    fetchPoap,
    { data: poapsData, loading: loadingPoaps, pagination: paginationPoaps }
  ] = useLazyQueryWithPagination(poapsQuery);

  // save data to tokensData and user if further so, if we apply filter we can set this to null,
  // and fetch next data call will not be made
  let tokensData = data || poapsData || null;

  const shouldFetchTokens = address.length > 0;
  const hasMultipleTokens = address.length > 1;

  const [showModal, setShowModal] = useState(false);
  const [modalValues, setModalValues] = useState<{
    leftValues: string[];
    rightValues: string[];
    dataType: string;
  }>({
    leftValues: [],
    rightValues: [],
    dataType: ''
  });

  const isPoap = inputType === 'POAP';

  useEffect(() => {
    if (shouldFetchTokens) {
      // eslint-disable-next-line
      tokensData = null;
      tokensRef.current = [];
      setTokens([]);
      setShowStatusLoader(true);
      setLoaderStats({
        total: LIMIT,
        matching: 0
      });

      if (isPoap) {
        fetchPoap({
          limit: LIMIT,
          ...requestFilters
        });
        return;
      }

      fetchTokens({
        limit: LIMIT,
        ...requestFilters
      });
    }
  }, [
    fetchPoap,
    fetchTokens,
    filters,
    isPoap,
    requestFilters,
    shouldFetchTokens
  ]);

  const { hasNextPage, getNextPage } = isPoap
    ? paginationPoaps
    : paginationTokens;

  const loading = loadingPoaps || loadingTokens;
  const loaderContext = useLoaderContext();

  useEffect(() => {
    loaderContext.setIsLoading(loading);
  }, [loaderContext, loading]);

  const getPoapList = useCallback(
    (tokensData: PoapsData): [Poap[], number] => {
      const poaps = tokensData?.Poaps?.Poap || [];
      if (!hasMultipleTokens) {
        return [removeDuplicateOwners(poaps) as Poap[], poaps.length];
      }
      const visitedSet = new Set();
      const poapsWithValues = poaps
        .filter(token => {
          const poaps = token.owner.poaps;

          if (!poaps || poaps.length === 0) return false;

          const poap = poaps[0];
          const address = Array.isArray(token.owner.addresses)
            ? poap.owner.addresses[0]
            : poap.owner.addresses;
          const duplicate = visitedSet.has(address);
          visitedSet.add(address);
          return !duplicate;
        })
        .map(token => {
          return {
            ...token.owner.poaps[0],
            _poapEvent: token.poapEvent
          };
        });
      return [poapsWithValues, poaps.length];
    },
    [hasMultipleTokens]
  );

  const getTokenList = useCallback(
    (tokensData: TokensData): [TokenType[], number] => {
      let ethTokenBalances: TokenType[] =
        tokensData.ethereum?.TokenBalance || [];
      let polygonTokenBalances: TokenType[] =
        tokensData.polygon?.TokenBalance || [];
      const originalSize =
        ethTokenBalances.length + polygonTokenBalances.length;

      if (hasMultipleTokens) {
        ethTokenBalances = ethTokenBalances
          .filter(token => token.owner?.tokenBalances?.length)
          .map(token => token.owner?.tokenBalances[0]);

        polygonTokenBalances = polygonTokenBalances
          .filter(token => token.owner?.tokenBalances?.length)
          .map(token => token.owner?.tokenBalances[0]);
      }
      const tokens = removeDuplicateOwners([
        ...ethTokenBalances,
        ...polygonTokenBalances
      ]) as TokenType[];

      return [tokens, originalSize];
    },
    [hasMultipleTokens]
  );

  useEffect(() => {
    if (!tokensData || loading) return;
    const [tokens, size] = isPoap
      ? getPoapList(tokensData)
      : getTokenList(tokensData);

    const filteredTokens = filterTokens(filters, tokens);

    setLoaderStats(({ total, matching }) => ({
      total: total + (size || 0),
      matching: matching + filteredTokens.length
    }));
    tokensRef.current = [...tokensRef.current, ...filteredTokens];
    setTokens(existingTokens => [...existingTokens, ...filteredTokens]);

    if (tokensRef.current.length < LIMIT && hasNextPage) {
      getNextPage();
    } else {
      setShowStatusLoader(false);
    }
  }, [
    filters,
    isPoap,
    tokensData,
    loading,
    hasNextPage,
    getNextPage,
    getPoapList,
    getTokenList
  ]);

  const handleShowMore = useCallback((values: string[], dataType: string) => {
    const leftValues: string[] = [];
    const rightValues: string[] = [];
    values.forEach((value, index) => {
      if (index % 2 === 0) {
        leftValues.push(value);
      } else {
        rightValues.push(value);
      }
    });
    setModalValues({
      leftValues,
      rightValues,
      dataType
    });
    setShowModal(true);
  }, []);

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
          total={loaderStats.total}
          matching={loaderStats.matching}
        />
      </>
    );
  }

  return (
    <>
      <div className="w-full border-solid-light rounded-2xl sm:overflow-hidden pb-5 overflow-y-auto">
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
                  <Token token={token} onShowMore={handleShowMore} />
                </TableRow>
              ))}
            </tbody>
          </table>
          {loading && <Loader />}
        </InfiniteScroll>
        <Modal
          heading={`All ${modalValues.dataType} names of ${address.join(', ')}`}
          isOpen={showModal}
          onRequestClose={() => {
            setShowModal(false);
            setModalValues({
              leftValues: [],
              rightValues: [],
              dataType: ''
            });
          }}
        >
          <div className="w-[600px] max-h-[60vh] h-auto bg-primary rounded-xl p-5 overflow-auto flex">
            <div className="flex-1">
              {modalValues.leftValues.map((value, index) => (
                <div className="mb-8" key={index}>
                  {value}
                </div>
              ))}
            </div>
            <div className="border-l border-solid border-stroke-color flex-1 pl-5">
              {modalValues.rightValues.map((value, index) => (
                <div className="mb-8" key={index}>
                  {value}
                </div>
              ))}
            </div>
          </div>
        </Modal>
      </div>
      {(loading || showStatusLoader) && (
        <StatusLoader
          total={loaderStats.total}
          matching={loaderStats.matching}
        />
      )}
    </>
  );
}

export const OverviewDetailsTokens = memo(TokensComponent);
