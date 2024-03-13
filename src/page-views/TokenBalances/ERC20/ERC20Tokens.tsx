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
import { defaultSortOrder } from '../../../Components/Filters/SortBy';
import { snapshotBlockchains, tokenBlockchains } from '../../../constants';
import { useSearchInput } from '../../../hooks/useSearchInput';
import { getNftWithCommonOwnersSnapshotQuery } from '../../../queries/Snapshots/nftWithCommonOwnersSnapshotQuery';
import { getNftWithCommonOwnersQuery } from '../../../queries/nftWithCommonOwnersQuery';
import {
  getActiveSnapshotInfo,
  getSnapshotQueryFilters
} from '../../../utils/activeSnapshotInfoString';
import { addToActiveTokenInfo } from '../../../utils/activeTokenInfoString';
import { emit } from '../../../utils/eventEmitter/eventEmitter';
import { SectionHeader } from '../SectionHeader';
import { CommonTokenType, TokenType } from '../types';
import { Image } from '@/Components/Image';

import './styles.css';

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
    // @ts-ignore
    return <Image src="images/placeholder.svg" {...props} />;
  }
  // @ts-ignore
  return <Image src={logo} onError={() => setError(true)} {...props} />;
}

function Token({
  amount,
  symbol,
  type,
  logo,
  blockchain
}: {
  type: string;
  symbol: string;
  amount: null | number;
  logo: string;
  blockchain: string;
}) {
  return (
    <div className="flex mb-5 hover:bg-glass px-3 py-1.5 rounded-18 overflow-hidden">
      <div
        className="h-10 w-10 rounded-full overflow-hidden border-solid-stroke flex-col-center"
        data-loader-type="hidden"
      >
        <Logo logo={logo} symbol={symbol} className="w-full min-w-full" />
      </div>
      <div className="flex-1 items-center min-w-0 text-sm pl-2.5">
        {amount !== null && (
          <div className="text-sm font-medium">{amount.toFixed(2)}</div>
        )}
        <div>
          <span className="text-sm font-medium">{symbol}</span>{' '}
          <span className="text-xs text-text-secondary lowercase whitespace-nowrap">
            {type} • {blockchain}
          </span>
        </div>
      </div>
    </div>
  );
}

function filterByMintsOnly(tokens: TokenType[]) {
  return tokens?.filter(item => item?.tokenTransfers?.[0]?.type === 'MINT');
}

function filterByIsSpam(tokens: TokenType[]) {
  return tokens?.filter(item => item?.token?.isSpam !== true);
}

function processTokens(tokens: any) {
  if (tokens.length > 0 && tokens[0]?.token?.tokenBalances) {
    tokens = tokens
      .filter((item: CommonTokenType) => item.token.tokenBalances.length > 0)
      .reduce((items: TokenType[], token: CommonTokenType) => {
        items.push(token.token.tokenBalances[0]);
        return items;
      }, []);
  }
  return tokens;
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
      spamFilter,
      mintFilter,
      activeTokenInfo,
      activeSnapshotInfo
    },
    setSearchData
  ] = useSearchInput();
  const tokensRef = useRef<TokenType[]>([]);
  const [loading, setLoading] = useState(false);

  const isCombination = owners.length > 1;

  const isSpamFilteringEnabled = spamFilter !== '0';
  const isMintFilteringEnabled = mintFilter === '1';

  const snapshotInfo = useMemo(
    () => getActiveSnapshotInfo(activeSnapshotInfo),
    [activeSnapshotInfo]
  );

  const query = useMemo(() => {
    const fetchAllBlockchains = blockchainType?.length === 0;

    const blockchain = fetchAllBlockchains ? null : blockchainType[0];

    if (snapshotInfo.isApplicable) {
      return getNftWithCommonOwnersSnapshotQuery({
        owners,
        blockchain: blockchain,
        snapshotFilter: snapshotInfo.appliedFilter
      });
    }
    return getNftWithCommonOwnersQuery({
      owners,
      blockchain,
      mintsOnly: isMintFilteringEnabled
    });
  }, [
    blockchainType,
    snapshotInfo.isApplicable,
    snapshotInfo.appliedFilter,
    owners,
    isMintFilteringEnabled
  ]);

  const handleData = useCallback(
    (data: any) => {
      const appropriateBlockchains = snapshotInfo.isApplicable
        ? snapshotBlockchains
        : tokenBlockchains;

      let processedTokenCount = 0;

      appropriateBlockchains.forEach(blockchain => {
        const tokenBalances = data?.[blockchain]?.TokenBalance || [];
        processedTokenCount += tokenBalances.length;
      });
      setTotalProcessedTokens(count => count + processedTokenCount);

      let filteredTokens: TokenType[] = [];

      appropriateBlockchains.forEach(blockchain => {
        const tokenBalances = data?.[blockchain]?.TokenBalance || [];
        filteredTokens.push(...processTokens(tokenBalances));
      });

      if (isMintFilteringEnabled) {
        filteredTokens = filterByMintsOnly(filteredTokens);
      }

      if (isSpamFilteringEnabled) {
        filteredTokens = filterByIsSpam(filteredTokens);
      }

      tokensRef.current = [...tokensRef.current, ...filteredTokens];
      setTokens(prevTokens => [...prevTokens, ...filteredTokens]);
    },
    [isMintFilteringEnabled, isSpamFilteringEnabled, snapshotInfo.isApplicable]
  );

  const [fetch, { data: erc20Data, pagination }] = useLazyQueryWithPagination(
    query,
    {},
    { onCompleted: handleData }
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
      Even though ERC20 tokens are not dependant on tokenType we added tokenType to the dependency array to force a refetch when tokenType changes.
      Without this, the tokens list would be unable to fetch additional pages since the window scroll height would be too great (too many ERC20 items).
      InfiniteScroll depends on the window scroll height, if the height is too high, user will have to scroll to the bottom to initiate a pagination call.
    */
  }, [
    fetch,
    owners.length,
    tokenType,
    blockchainType,
    sortOrder,
    spamFilter,
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
      total: totalProcessedTokens,
      loading
    });
  }, [loading, tokens.length, totalProcessedTokens]);

  return (
    <div>
      <div className="pb-2 sm:pb-0">
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
                blockchain={token?.blockchain}
              />
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
}
