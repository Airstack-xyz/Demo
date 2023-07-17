import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  ComponentProps
} from 'react';
import { ERC20TokensQuery } from '../../queries';
import { SectionHeader } from './SectionHeader';
import { TokenType } from './types';
import classNames from 'classnames';
import { useSearchInput } from '../../hooks/useSearchInput';
import { createTokenHolderUrl } from '../../utils/createTokenHolderUrl';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

type LogoProps = Omit<ComponentProps<'img'>, 'src'> & {
  logo: string;
};

function Logo({ logo, ...props }: LogoProps) {
  const [error, setError] = useState(false);
  if (error || !logo) {
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
    <div className="flex mb-5 hover:bg-glass px-3 py-1.5 rounded-md overflow-hidden">
      <div className="h-10 w-10 rounded-full overflow-hidden border-solid-stroke">
        <Logo logo={logo} className="w-full" />
      </div>
      <div className="flex flex-1 items-center min-w-0 text-sm pl-2.5">
        <span className="ellipsis max-w-[30%]">{amount}</span>
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
        <div
          className="skeleton-loader [&>div]:mb-0 mb-5"
          data-loader-type="block"
          data-loader-bg="glass"
          key={index}
        >
          <Token key={''} amount={0} symbol={''} type={''} logo="" />
        </div>
      ))}
    </>
  );
}

export function ERC20Tokens() {
  const [tokens, setTokens] = useState<{
    ethereum: TokenType[];
    polygon: TokenType[];
  }>({
    ethereum: [],
    polygon: []
  });

  const [fetch, { data: data, loading, pagination }] =
    useLazyQueryWithPagination(ERC20TokensQuery);
  const { address: owner } = useSearchInput();

  useEffect(() => {
    if (owner) {
      fetch({
        owner,
        limit: 30
      });
      setTokens({
        ethereum: [],
        polygon: []
      });
    }
  }, [fetch, owner]);

  useEffect(() => {
    if (data) {
      setTokens(existingTokens => ({
        ethereum: [
          ...existingTokens.ethereum,
          ...(data?.ethereum?.TokenBalance || [])
        ],
        polygon: [
          ...existingTokens.polygon,
          ...(data?.polygon?.TokenBalance || [])
        ]
      }));
    }
  }, [data]);

  const { hasNextPage, getNextPage } = pagination;

  const handleNext = useCallback(() => {
    if (!loading && hasNextPage) {
      getNextPage();
    }
  }, [getNextPage, hasNextPage, loading]);

  const items = useMemo((): TokenType[] => {
    return [...tokens.ethereum, ...tokens.polygon];
  }, [tokens.ethereum, tokens.polygon]);

  if (items.length === 0 && !loading) {
    return (
      <div className="flex flex-1 justify-center mt-10">No data found!</div>
    );
  }

  return (
    <div className="mt-11">
      <div className="hidden sm:block">
        <SectionHeader iconName="erc20" heading="ERC20 tokens" />
      </div>
      <div
        className={classNames(
          'mt-3.5 bg-glass py-3 px-2 rounded-18 border-solid-stroke',
          {
            'skeleton-loader': items.length === 0 && loading
          }
        )}
        data-loader-type="block"
        data-loader-height="auto"
      >
        <InfiniteScroll
          next={handleNext}
          dataLength={items.length}
          hasMore={hasNextPage}
          loader={<Loader />}
        >
          {items.map((token, index) => (
            <Link to={createTokenHolderUrl(token?.tokenAddress)}>
              <Token
                key={index}
                amount={token?.formattedAmount}
                symbol={token?.token?.symbol}
                type={token?.token?.name}
                logo={token?.token?.logo?.small}
              />
            </Link>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
}
