import "./App.css";
import { init, useLazyQueryWithPagination } from "airstack-web-sdk-test";
import { List } from "./Components/List";
import { Header } from "./Components/Header";

const query = `query GetNFTsOwnedByUser($owner: Identity, $limit: Int, $cursor: String) {
  TokenBalances(
    input: {filter: {owner: {_eq: $owner}, tokenType: {_in: [ERC1155, ERC721]}}, blockchain: ethereum, limit: $limit, cursor: $cursor}
  ) {
    TokenBalance {
      amount
      tokenType
      tokenAddress
      tokenNfts {
        tokenId
      }
      token {
        name
        symbol
      }
    } 
    pageInfo {
      nextCursor
      prevCursor
    }
  }
}`;

init("ef3d1cdeafb642d3a8d6a44664ce566c");

function App() {
  const [getData, { data, loading, error, pagination }] =
    useLazyQueryWithPagination(query);

  const { hasNextPage, hasPrevPage, getNextPage, getPrevPage } = pagination;

  const handleSubmit = (query: string) => {
    getData({ owner: query, limit: 5 });
  };

  const tokenList = data?.TokenBalances?.TokenBalance || [];

  return (
    <>
      <Header onSubmit={handleSubmit} disabled={loading} />
      <main>
        {data?.TokenBalances &&
          data?.TokenBalances.TokenBalance === null &&
          !loading && <div> No data found! </div>}
        {loading && <div className="loader">Loading...</div>}
        {tokenList.length > 0 && (
          <>
            <List items={tokenList} />
            <footer>
              <button
                disabled={!hasPrevPage || loading}
                onClick={() => getPrevPage()}
              >
                Prev Page
              </button>
              <button
                disabled={!hasNextPage || loading}
                onClick={() => getNextPage()}
              >
                Next Page
              </button>
            </footer>
          </>
        )}
        {error && <p>{error.message}</p>}
      </main>
    </>
  );
}

export default App;
