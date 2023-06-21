import InfiniteScroll from "react-infinite-scroll-component";
import { Item } from "./Item";
import { useLazyQueryWithPagination } from "@airstack/airstack-react";
import { query } from "../queries";
import { useCallback, useEffect, useState } from "react";
import { ListTitle } from "./ListTitle";

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

export function Tokens({ owner }: { owner: string }) {
  const [fetch, { data, error, loading, pagination }] =
    useLazyQueryWithPagination(query);
  const { hasNextPage, getNextPage } = pagination;

  const [tokens, setTokens] = useState<any[]>([]);

  useEffect(() => {
    if (owner) {
      fetch({
        owner,
        limit: 20,
      });
      setTokens([]);
    }
  }, [fetch, owner]);

  useEffect(() => {
    if (data) {
      const newTokens = data?.TokenBalances?.TokenBalance || [];
      setTokens((tokens) => [...tokens, ...newTokens]);
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
      <ListTitle title="NFTs held" icon="nft" />
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
                    tokenNfts: { tokenId },
                    token: { name, symbol },
                  }) => (
                    <Item
                      key={tokenId}
                      tokenAddress={tokenAddress}
                      tokenId={tokenId}
                      tokenType={tokenType}
                      amount={amount}
                      tokenName={name}
                      tokenSymbol={symbol}
                    />
                  )
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
