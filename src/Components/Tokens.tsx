import InfiniteScroll from 'react-infinite-scroll-component';
import { Item } from './Item';
import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { query } from '../queries';
import { useCallback, useEffect, useState } from 'react';
import { ListTitle } from './ListTitle';
import { useSearchInput } from '../hooks/useSearchInput';

function Header() {
  return (
    <thead>
      <tr>
        <th>Token Image</th>
        <th style={{ width: 100 }}>ID</th>
        <th>Token Name</th>
        <th>Symbol</th>
        <th>Token Type</th>
        <th>Token Address</th>
        <th style={{ width: 100 }}>Amount</th>
      </tr>
    </thead>
  );
}

export function Tokens() {
  const [fetch, { data, error, loading, pagination }] =
    useLazyQueryWithPagination(query);
  const { hasNextPage, getNextPage } = pagination;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tokens, setTokens] = useState<any[]>([]);
  const { query: owner } = useSearchInput();

  useEffect(() => {
    if (owner) {
      fetch({
        owner,
        limit: 10
      });
      setTokens([]);
    }
  }, [fetch, owner]);

  useEffect(() => {
    if (data) {
      const { ethereum, polygon } = data;
      const ethTokens = ethereum?.TokenBalance || [];
      const maticTokens = polygon?.TokenBalance || [];
      setTokens(tokens => [...tokens, ...ethTokens, ...maticTokens]);
    }
  }, [data]);

  const handleNext = useCallback(() => {
    if (hasNextPage) {
      getNextPage();
    }
  }, [getNextPage, hasNextPage]);

  const dataNotFound = !error && !loading && tokens.length === 0;

  return (
    <div className="tokens">
      <ListTitle title="NFTs" icon="nft" />
      {tokens.length === 0 && loading && (
        <div className="loader">Loading...</div>
      )}
      {dataNotFound && <div> No data found! </div>}
      {tokens.length > 0 && (
        <InfiniteScroll
          next={handleNext}
          dataLength={tokens.length}
          hasMore={pagination.hasNextPage}
          loader={<div className="loader">Loading...</div>}
        >
          <div className="tokens-table-wrapper">
            <table>
              <Header />
              <tbody>
                {tokens.map(
                  ({
                    tokenAddress,
                    amount,
                    tokenType,
                    tokenNfts,
                    token,
                    blockchain
                  }) => {
                    const { tokenId } = tokenNfts || {};
                    const { name, symbol } = token || {};
                    return (
                      <Item
                        key={tokenId}
                        tokenAddress={tokenAddress}
                        tokenId={tokenId}
                        tokenType={tokenType}
                        amount={amount}
                        tokenName={name}
                        tokenSymbol={symbol}
                        blockchain={blockchain}
                      />
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </InfiniteScroll>
      )}
      {error && tokens.length === 0 && (
        <div style={{ marginTop: 20 }}> Error while fetching data! </div>
      )}
    </div>
  );
}
