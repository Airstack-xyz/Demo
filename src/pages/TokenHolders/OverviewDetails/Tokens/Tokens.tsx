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
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Poap, Token as TokenType } from '../../types';
import { filterTokens, getRequestFilters } from './filters';
import {
  getFilterablePoapsQuery,
  getFilterableTokensQuery
} from '../../../../queries/token-holders';
import { Token } from './Token';
import classNames from 'classnames';
import { StatusLoader } from './StatusLoader';
import { useLoaderContext } from '../../../../hooks/useLoader';

const LIMIT = 50;

const loaderData = Array(6).fill({});

type TableRowProps = ComponentProps<'tr'> & {
  isLoader?: boolean;
};

function TableRow({ isLoader, children, ...props }: TableRowProps) {
  return (
    <tr
      className={classNames(
        '[&>td]:px-8 [&>td]:py-5 [&>td]:align-middle min-h-[54px] hover:bg-glass cursor-pointer',
        { 'skeleton-loader [&>td:last-child]:hidden': isLoader }
      )}
      data-loader-type="block"
      data-loader-margin="10"
      {...props}
    >
      {children}
    </tr>
  );
}

function Loader() {
  return (
    <>
      {loaderData.map((_, index) => (
        <TableRow isLoader={true} key={index}>
          <Token token={null} />
        </TableRow>
      ))}
    </>
  );
}

export function TokensComponent() {
  const [tokens, setTokens] = useState<(TokenType | Poap)[]>([]);
  const tokensRef = useRef<(TokenType | Poap)[]>([]);
  const [{ tokenFilters: filters }] = useSearchInput();
  const [showStatusLoader, setShowStatusLoader] = useState(false);
  const [loaderStats, setLoaderStats] = useState({
    total: 0,
    matching: 0
  });

  const requestFilters = useMemo(() => {
    return getRequestFilters(filters);
  }, [filters]);

  const { tokensQuery, poapsQuery } = useMemo(() => {
    const tokensQuery = getFilterableTokensQuery(
      Boolean(requestFilters?.socialFilters),
      requestFilters?.hasPrimaryDomain
    );
    const poapsQuery = getFilterablePoapsQuery(
      Boolean(requestFilters?.socialFilters),
      requestFilters?.hasPrimaryDomain
    );
    return {
      tokensQuery,
      poapsQuery
    };
  }, [requestFilters?.hasPrimaryDomain, requestFilters?.socialFilters]);

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
  let tokensData = data || null;

  const [{ address: tokenAddress, inputType }] = useSearchInput();

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

  const navigate = useNavigate();
  const isPoap = inputType === 'POAP';

  useEffect(() => {
    if (tokenAddress) {
      // eslint-disable-next-line
      tokensData = null;
      tokensRef.current = [];
      setTokens([]);
      setShowStatusLoader(true);
      setLoaderStats({
        total: 0,
        matching: 0
      });

      if (isPoap) {
        fetchPoap({
          eventId: tokenAddress,
          limit: LIMIT,
          ...requestFilters
        });
        return;
      }

      fetchTokens({
        tokenAddress,
        limit: LIMIT,
        ...requestFilters
      });
    }
  }, [fetchPoap, fetchTokens, filters, isPoap, requestFilters, tokenAddress]);

  const { hasNextPage, getNextPage } = isPoap
    ? paginationPoaps
    : paginationTokens;

  const loading = loadingPoaps || loadingTokens;
  const loaderContext = useLoaderContext();
  useEffect(() => {
    loaderContext.setIsLoading(loading);
  }, [loaderContext, loading]);

  useEffect(() => {
    if (!tokensData || isPoap || loading) return;

    const ethTokenBalances: TokenType[] =
      tokensData.ethereum?.TokenBalance || [];
    const polygonTokenBalances: TokenType[] =
      tokensData.polygon?.TokenBalance || [];

    const tokens = [...ethTokenBalances, ...polygonTokenBalances];

    const filteredTokens = filterTokens(filters, tokens);

    tokensRef.current = [...tokensRef.current, ...filteredTokens];

    setLoaderStats(({ total }) => ({
      total: total + (tokens.length || 0),
      matching: tokensRef.current.length
    }));

    if (tokensRef.current.length < LIMIT && hasNextPage) {
      getNextPage();
    } else {
      setTokens(existingTokens => [...existingTokens, ...tokensRef.current]);
      setShowStatusLoader(false);
    }
  }, [filters, isPoap, tokensData, loading, hasNextPage, getNextPage]);

  useEffect(() => {
    if (!poapsData) return;
    const tokens = poapsData?.Poaps?.Poap || [];
    const filteredPoaps = filterTokens(filters, tokens);

    tokensRef.current = [...tokensRef.current, ...filteredPoaps];

    setLoaderStats(({ total }) => ({
      total: total + (tokens.length || 0),
      matching: tokensRef.current.length
    }));

    if (tokensRef.current.length < LIMIT && hasNextPage) {
      getNextPage();
    } else {
      setTokens(existingPoaps => [...existingPoaps, ...tokensRef.current]);
      setShowStatusLoader(false);
    }
  }, [filters, getNextPage, hasNextPage, poapsData]);

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
          <table className="w-auto text-xs table-fixed sm:w-full">
            <tbody>
              <Loader />
            </tbody>
          </table>
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
                <TableRow
                  key={index}
                  onClick={() => {
                    const address = token?.owner?.addresses || '';
                    if (address) {
                      navigate(
                        `/token-balances?address=${address}&rawInput=${address}`
                      );
                    }
                  }}
                >
                  <Token token={token} onShowMore={handleShowMore} />
                </TableRow>
              ))}
              {loading && <Loader />}
            </tbody>
          </table>
        </InfiniteScroll>
        <Modal
          heading={`All ${modalValues.dataType} names of ${tokenAddress}`}
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
