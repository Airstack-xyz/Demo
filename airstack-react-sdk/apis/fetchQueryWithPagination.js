import { addPaginationToQuery } from "../utils/addPaginationToQuery.js";
import { fetchPaginatedQuery } from "./fetchPaginatedQuery.js";
async function fetchQueryWithPagination(query, variables, config) {
  const queryWithPagination = await addPaginationToQuery(query);
  return fetchPaginatedQuery(
    queryWithPagination,
    variables || {},
    config || {}
  );
}
export {
  fetchQueryWithPagination
};
