import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { ERC20TokensQuery } from '../../queries';
import { SectionHeader } from './SectionHeader';
import { TokenType } from './types';
import classNames from 'classnames';
import { useSearchInput } from '../../hooks/useSearchInput';
import { createTokenHolderUrl } from '../../utils/createTokenHolderUrl';
import { Link } from 'react-router-dom';
import { Asset } from '../../Components/Asset';
import InfiniteScroll from 'react-infinite-scroll-component';

function Token({
  amount,
  symbol,
  type,
  address,
  tokenId,
  blockchain
}: {
  type: string;
  symbol: string;
  amount: number;
  address: string;
  tokenId: string;
  blockchain: 'ethereum' | 'polygon';
}) {
  return (
    <div className="flex mb-5 hover:bg-glass px-3 py-1.5 rounded-md overflow-hidden">
      <div className="h-10 w-10 rounded-full overflow-hidden border-solid-stroke">
        {address && tokenId && (
          <Asset
            address={address}
            tokenId={tokenId}
            chain={blockchain}
            preset="medium"
          />
        )}
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
        <div className="skeleton-loader" key={index}>
          <Token
            key={''}
            amount={0}
            symbol={''}
            type={''}
            address={''}
            tokenId={''}
            blockchain={'ethereum'}
          />
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
        limit: 5
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

  const handleNext = useCallback(() => {
    pagination?.getNextPage();
  }, [pagination]);

  const items = useMemo((): TokenType[] => {
    return loading ? loaderData : [...tokens.ethereum, ...tokens.polygon];
  }, [loading, tokens.ethereum, tokens.polygon]);

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
        {items.length > 0 && (
          <InfiniteScroll
            next={handleNext}
            dataLength={items.length}
            hasMore={pagination.hasNextPage}
            loader={<Loader />}
          >
            {items.map((token, index) => (
              <Link to={createTokenHolderUrl(token?.tokenAddress)}>
                <Token
                  key={index}
                  amount={token?.formattedAmount}
                  symbol={token?.token?.symbol}
                  type={token?.token?.name}
                  address={token?.tokenAddress}
                  tokenId={token?.tokenNfts?.tokenId}
                  blockchain={token?.blockchain}
                />
              </Link>
            ))}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}
