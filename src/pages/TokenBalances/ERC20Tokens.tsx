import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import classNames from 'classnames';
import {
  ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { defaultSortOrder } from '../../Components/Filters/SortBy';
import { useSearchInput } from '../../hooks/useSearchInput';
import { getNftWithCommonOwnersQuery } from '../../queries/nftWithCommonOwnersQuery';
import { getNftWithCommonOwnersSnapshotQuery } from '../../queries/nftWithCommonOwnersSnapshotQuery';
import {
  getActiveSnapshotInfo,
  getSnapshotQueryFilters
} from '../../utils/activeSnapshotInfoString';
import { addToActiveTokenInfo } from '../../utils/activeTokenInfoString';
import { emit } from '../../utils/eventEmitter/eventEmitter';
import { formatNumber } from '../../utils/formatNumber';
import { SectionHeader } from './SectionHeader';
import { CommonTokenType, TokenType } from './types';

import './erc20.styles.css';

type LogoProps = Omit<ComponentProps<'img'>, 'src'> & {
  logo: string;
  symbol: string;
};

function Logo({ logo, symbol, ...props }: LogoProps) {
  const [error, setError] = useState(false);
  if (error || !logo) {
    if (symbol) {
      const text = symbol.substring(0, 3);
      return (
        <div className="item flex justify-center items-center h-full w-full font-medium text-xs ellipsis">
          {text.toUpperCase()}
          {symbol.length > 3 ? '..' : ''}
        </div>
      );
    }
    return <img src="images/placeholder.svg" {...props} />;
  }
  return <img src={logo} onError={() => setError(true)} {...props} />;
}

function Token({
  amount,
  symbol,
  type,
  logo
}: {
  type: string;
  symbol: string;
  amount: null | number;
  logo: string;
}) {
  return (
    <div className="flex mb-5 hover:bg-glass px-3 py-1.5 rounded-18 overflow-hidden">
      <div
        className="h-10 w-10 rounded-full overflow-hidden border-solid-stroke flex-col-center"
        data-loader-type="hidden"
      >
        <Logo logo={logo} symbol={symbol} className="w-full min-w-full" />
      </div>
      <div className="flex flex-1 items-center min-w-0 text-sm pl-2.5">
        {amount !== null && <span>{formatNumber(amount)}</span>}
        <span className="mx-1.5 ellipsis">{symbol}</span>
        <span className="text-xs text-text-secondary ellipsis min-w-[30%] lowercase">
          {type}
        </span>
      </div>
    </div>
  );
}

const loaderData = Array(3).fill({ poapEvent: {} });

function Loader() {
  return (
    <>
      {loaderData.map((_, index) => (
        <div className="skeleton-loader [&>div>div]:mb-0 mb-5" key={index}>
          <div data-loader-type="block" data-loader-bg="glass">
            <Token key={''} amount={0} symbol={''} type={''} logo="" />
          </div>
        </div>
      ))}
    </>
  );
}

const LIMIT = 20;
const MIN_LIMIT = 10;

export function ERC20Tokens() {
  const [totalProcessedTokens, setTotalProcessedTokens] = useState(0);
  const [tokens, setTokens] = useState<TokenType[]>([]);
  const [
    {
      address: owners,
      tokenType,
      blockchainType,
      sortOrder,
      activeTokenInfo,
      activeSnapshotInfo
    },
    setSearchData
  ] = useSearchInput();
  const tokensRef = useRef<TokenType[]>([]);
  const [loading, setLoading] = useState(false);

  const isCombination = owners.length > 1;

  const snapshotInfo = useMemo(
    () => getActiveSnapshotInfo(activeSnapshotInfo),
    [activeSnapshotInfo]
  );

  const query = useMemo(() => {
    const fetchAllBlockchains =
      blockchainType.length === 3 || blockchainType.length === 0;

    const blockchain = fetchAllBlockchains ? null : blockchainType[0];

    if (snapshotInfo.isApplicable) {
      return getNftWithCommonOwnersSnapshotQuery({
        owners,
        blockchain: blockchain,
        appliedSnapshotFilter: snapshotInfo.appliedFilter
      });
    }
    return getNftWithCommonOwnersQuery(owners, blockchain);
  }, [
    blockchainType,
    snapshotInfo.isApplicable,
    snapshotInfo.appliedFilter,
    owners
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onData = useCallback((data: any) => {
    const { ethereum, polygon, base } = data;
    let ethTokenBalances = ethereum?.TokenBalance || [];
    let polygonTokenBalances = polygon?.TokenBalance || [];
    let baseTokenBalances = base?.TokenBalance || [];

    const totalTokens =
      ethTokenBalances.length +
      polygonTokenBalances.length +
      baseTokenBalances.length;

    if (
      ethTokenBalances.length > 0 &&
      ethTokenBalances[0]?.token?.tokenBalances
    ) {
      ethTokenBalances = ethTokenBalances
        .filter(
          (token: CommonTokenType) => token.token.tokenBalances.length > 0
        )
        .reduce((items: TokenType[], token: CommonTokenType) => {
          items.push(token.token.tokenBalances[0]);
          //   token.token.tokenBalances.forEach(item => items.push(item));
          return items;
        }, []);
    }
    if (
      polygonTokenBalances.length > 0 &&
      polygonTokenBalances[0]?.token?.tokenBalances
    ) {
      polygonTokenBalances = polygonTokenBalances
        .filter(
          (token: CommonTokenType) => token.token.tokenBalances.length > 0
        )
        .reduce((items: TokenType[], token: CommonTokenType) => {
          items.push(token.token.tokenBalances[0]);
          //   token.token.tokenBalances.forEach(item => items.push(item));
          return items;
        }, []);
    }
    if (
      baseTokenBalances.length > 0 &&
      baseTokenBalances[0]?.token?.tokenBalances
    ) {
      baseTokenBalances = baseTokenBalances
        .filter(
          (token: CommonTokenType) => token.token.tokenBalances.length > 0
        )
        .reduce((items: TokenType[], token: CommonTokenType) => {
          items.push(token.token.tokenBalances[0]);
          //   token.token.tokenBalances.forEach(item => items.push(item));
          return items;
        }, []);
    }

    tokensRef.current = [
      ...tokensRef.current,
      ...ethTokenBalances,
      ...polygonTokenBalances,
      ...baseTokenBalances
    ];

    setTotalProcessedTokens(count => count + totalTokens);
    setTokens(tokens => [
      ...tokens,
      ...ethTokenBalances,
      ...polygonTokenBalances,
      ...baseTokenBalances
    ]);
  }, []);

  const [fetch, { data: erc20Data, pagination }] = useLazyQueryWithPagination(
    query,
    {},
    { cache: false, onCompleted: onData }
  );

  let data = erc20Data;
  const { hasNextPage, getNextPage } = pagination;

  useEffect(() => {
    if (owners.length > 0) {
      setLoading(true);
      tokensRef.current = [];
      setTokens([]);
      setTotalProcessedTokens(0);
      // Remove data to make sure on next render, the data is not used in the useEffect below
      // eslint-disable-next-line react-hooks/exhaustive-deps
      data = null;

      const limit = owners.length === 1 && tokenType ? MIN_LIMIT : LIMIT;

      if (snapshotInfo.isApplicable) {
        const queryFilters = getSnapshotQueryFilters(snapshotInfo);
        fetch({
          limit: limit,
          tokenType: ['ERC20'],
          ...queryFilters
        });
      } else {
        fetch({
          limit: limit,
          tokenType: ['ERC20'],
          sortBy: sortOrder ? sortOrder : defaultSortOrder
        });
      }
    }
    /*
      Even though ERC20 tokens are not dependant on tokenType, we added tokenType to the dependency array to force a refetch when tokenType changes.
      Without this, the tokens list would be unable to fetch additional pages since the window scroll height would be too great (too many ERC20 items).
      InfiniteScroll depends on the window scroll height, if the height is too high, user will have to scroll to the bottom to initiate a pagination call.
    */
  }, [
    fetch,
    owners.length,
    tokenType,
    blockchainType,
    sortOrder,
    snapshotInfo
  ]);

  useEffect(() => {
    if (!data) return;
    if (hasNextPage && tokensRef.current.length < MIN_LIMIT) {
      setLoading(true);
      getNextPage();
      return;
    }
    setLoading(false);
    tokensRef.current = [];
  }, [data, getNextPage, hasNextPage]);

  const handleNext = useCallback(() => {
    if (!loading && hasNextPage) {
      getNextPage();
      setLoading(true);
    }
  }, [getNextPage, hasNextPage, loading]);

  useEffect(() => {
    emit('token-balances:ERC20', {
      matched: tokens.length,
      total: totalProcessedTokens || LIMIT,
      loading
    });
  }, [loading, tokens.length, totalProcessedTokens]);

  return (
    <div>
      <div className="hidden sm:block">
        <SectionHeader
          iconName="erc20"
          heading={`ERC20 tokens${isCombination ? ' in common' : ''}`}
        />
      </div>
      <div
        className={classNames(
          'mt-3.5 bg-glass py-3 px-2 rounded-18 border-solid-stroke random-color-list',
          {
            'skeleton-loader min-h-[200px]': tokens.length === 0 && loading
          }
        )}
        data-loader-type="block"
        data-loader-height="auto"
      >
        {tokens.length === 0 && !loading && (
          <div className="flex flex-1 justify-center p-2 text-xs">
            No data found!
          </div>
        )}

        <InfiniteScroll
          next={handleNext}
          dataLength={tokens.length}
          hasMore={hasNextPage}
          loader={null}
        >
          {tokens.map((token, index) => (
            <div
              key={index}
              data-address={token?.tokenAddress}
              className="random-color-item cursor-pointer"
              onClick={() => {
                setSearchData(
                  {
                    activeTokenInfo: addToActiveTokenInfo(
                      {
                        tokenAddress: token?.tokenAddress,
                        tokenId: token?.tokenId || '',
                        blockchain: token?.blockchain,
                        eventId: ''
                      },
                      activeTokenInfo
                    )
                  },
                  { updateQueryParams: true }
                );
              }}
            >
              <Token
                amount={isCombination ? null : token?.formattedAmount}
                symbol={token?.token?.symbol}
                type={token?.token?.name}
                logo={
                  token?.token?.logo?.small ||
                  token?.token?.projectDetails?.imageUrl
                }
              />
            </div>
          ))}
          {loading && <Loader />}
        </InfiniteScroll>
      </div>
    </div>
  );
}
