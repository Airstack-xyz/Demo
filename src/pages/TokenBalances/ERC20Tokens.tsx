import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  ComponentProps,
  useRef
} from 'react';
import { SectionHeader } from './SectionHeader';
import { CommonTokenType, TokenType } from './types';
import classNames from 'classnames';
import { useSearchInput } from '../../hooks/useSearchInput';
import { createTokenHolderUrl } from '../../utils/createTokenUrl';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { formatNumber } from '../../utils/formatNumber';
import './erc20.styles.css';
import { createNftWithCommonOwnersQuery } from '../../queries/nftWithCommonOwnersQuery';
import { emit } from '../../utils/eventEmitter/eventEmitter';

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
  amount: number;
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
        <span>{formatNumber(amount)}</span>
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

const LIMIT = 50;
const MIN_LIMIT = 10;

export function ERC20Tokens() {
  const [totalProcessedTokens, setTotalProcessedTokens] = useState(0);
  const [tokens, setTokens] = useState<TokenType[]>([]);
  const [{ address: owners, tokenType, blockchainType, sortOrder }] =
    useSearchInput();
  const tokensRef = useRef<TokenType[]>([]);
  const [loading, setLoading] = useState(false);
  const query = useMemo(() => {
    return createNftWithCommonOwnersQuery(owners, null);
  }, [owners]);

  const [fetch, { data: erc20Data, pagination }] = useLazyQueryWithPagination(
    query,
    {},
    { cache: false }
  );

  let data = erc20Data;
  const { hasNextPage, getNextPage } = pagination;

  useEffect(() => {
    if (owners.length > 0) {
      setLoading(true);
      tokensRef.current = [];
      setTokens([]);
      setTotalProcessedTokens(0);
      // remove data to make sure on next render, the data is not used in the useEffect below
      // eslint-disable-next-line react-hooks/exhaustive-deps
      data = null;

      fetch({
        limit: LIMIT,
        tokenType: ['ERC20']
      });
    }
    /*
      Even though ERC20 tokens are not dependant on tokenType, we added tokenType to the dependency array to force a refetch when tokenType changes.
      Without this, the tokens list would be unable to fetch additional pages since the window scroll height would be too great (too many ERC20 items).
      InfiniteScroll depends on the window scroll height, if the height is too high, user will have to scroll to the bottom to initiate a pagination call.
    */
  }, [fetch, owners, tokenType, blockchainType, sortOrder]);

  useEffect(() => {
    if (!data) return;
    const { ethereum, polygon } = data;
    let ethTokens = ethereum?.TokenBalance || [];
    let maticTokens = polygon?.TokenBalance || [];
    const totalTokens = ethTokens.length + maticTokens.length;

    if (ethTokens.length > 0 && ethTokens[0]?.token?.tokenBalances) {
      ethTokens = ethTokens
        .filter(
          (token: CommonTokenType) => token.token.tokenBalances.length > 0
        )
        .reduce((items: TokenType[], token: CommonTokenType) => {
          items.push(token.token.tokenBalances[0]);
          //   token.token.tokenBalances.forEach(item => items.push(item));
          return items;
        }, []);
    }
    if (maticTokens.length > 0 && maticTokens[0]?.token?.tokenBalances) {
      maticTokens = maticTokens
        .filter(
          (token: CommonTokenType) => token.token.tokenBalances.length > 0
        )
        .reduce((items: TokenType[], token: CommonTokenType) => {
          items.push(token.token.tokenBalances[0]);
          //   token.token.tokenBalances.forEach(item => items.push(item));
          return items;
        }, []);
    }
    tokensRef.current = [...tokensRef.current, ...ethTokens, ...maticTokens];
    setTotalProcessedTokens(count => count + totalTokens);
    setTokens(tokensRef.current);
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
          heading={`ERC20 tokens${owners.length > 1 ? ' in common' : ''}`}
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
          <div className="flex flex-1 justify-center text-xs">
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
            <Link
              data-address={token?.tokenAddress}
              to={createTokenHolderUrl({
                address: token?.tokenAddress,
                type: 'ERC20',
                blockchain: token.blockchain,
                label: token?.token?.name
              })}
              className="random-color-item"
            >
              <Token
                key={index}
                amount={token?.formattedAmount}
                symbol={token?.token?.symbol}
                type={token?.token?.name}
                logo={
                  token?.token?.logo?.small ||
                  token?.token?.projectDetails?.imageUrl
                }
              />
            </Link>
          ))}
          {loading && <Loader />}
        </InfiniteScroll>
      </div>
    </div>
  );
}
