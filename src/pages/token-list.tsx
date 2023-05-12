import "../App.css";

import { List } from "../Components/List";
import { Header } from "../Components/Header";
import { query } from "../queries";

/*
  STEP 3: Import useLazyQueryWithPagination hook from airstack-web-sdk
*/
import { useLazyQueryWithPagination } from "@airstack/airstack-react";

function TokenList() {
  /*
    STEP 4: Call the useLazyQueryWithPagination hook. Pass the query as the parameter
    1. getData: a function to call the API and fetch data.
    2. data: the data returned from the API call.
    3. loading: a boolean state indicating the API fetch is in progress.
    4. error: an error returned by the API call.
    5. pagination:
      hasNextPage: a boolean indicating whether there is another page of data after the current page.
      hasPrevPage: a boolean indicating whether there is another page of data before the current page.
      getNextPage: a function that can be called to fetch the next page of data.
      getPrevPage: a function that can be called to fetch the previous page of data.
  */
  const [getData, { data, loading, error, pagination }] =
    useLazyQueryWithPagination(query);

  /*
    STEP 5: Destruct the variables of pagination
  */
  const { hasNextPage, hasPrevPage, getNextPage, getPrevPage } = pagination;

  /*
    STEP 6: Function to call `getData` and pass parameters
  */
  const handleSubmit = (query: string) => {
    getData({ owner: query, limit: 5 });
  };

  const tokenList = data?.TokenBalances?.TokenBalance || [];

  return (
    <>
      {/*
        STEP 7: On submit call `handleSubmit` function
      */}
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
              {/*
                STEP 8: On press of `Prev Page` call `getPrevPage` function
              */}
              <button
                disabled={!hasPrevPage || loading}
                onClick={() => getPrevPage()}
              >
                Prev Page
              </button>

              {/*
                STEP 9: On press of `Next Page` call `getNextPage` function
              */}
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

export default TokenList;
