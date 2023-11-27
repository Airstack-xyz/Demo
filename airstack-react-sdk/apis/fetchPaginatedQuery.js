import { fetchGql } from "../utils/fetcher.js";
import { getFromCache, cacheResponse } from "../cache.js";
import { getPaginationData } from "../utils/getPaginationData.js";
import { stringifyObjectValues } from "../utils/stringifyObjectValues.js";
import { removeQueriesIfNoNextPage } from "../utils/removeQueriesIfNoNextPage.js";
import { config } from "../config.js";
import { cacheImagesFromQuery } from "../utils/cacheImagesFromQuery.js";
async function fetchPaginatedQuery(originalQuery, variables, config$1) {
  let query = originalQuery;
  const nextCursorsCache = [];
  const deletedQueryCache = [];
  let paginationData = {
    hasNextPage: false,
    hasPrevPage: false,
    nextCursors: {},
    prevCursors: {}
  };
  let lastResponse = null;
  let inProgressRequest = null;
  async function fetch(_query, _variables, _config) {
    const variables2 = stringifyObjectValues(_variables || {});
    const config2 = { cache: config.cache, ..._config };
    let data = config2.cache ? getFromCache(_query, variables2 || {}) : null;
    let error = null;
    const aboardController = _config == null ? void 0 : _config.abortController;
    if (!data) {
      const [response, _error] = await fetchGql(
        _query,
        variables2,
        aboardController
      );
      data = response;
      error = _error;
      if (config2.cache && data && !error) {
        cacheResponse(response, _query, variables2);
      }
      cacheImagesFromQuery(data);
    } else {
      data = { ...data };
    }
    if (!(aboardController == null ? void 0 : aboardController.signal.aborted)) {
      paginationData = getPaginationData(data);
      lastResponse = data;
    }
    return {
      data,
      error,
      hasNextPage: paginationData.hasNextPage,
      hasPrevPage: paginationData.hasPrevPage,
      getNextPage: handleNext,
      getPrevPage: handlePrev
    };
  }
  const handleNext = async () => {
    if (inProgressRequest) {
      return inProgressRequest;
    }
    if (paginationData.hasNextPage) {
      nextCursorsCache.push(paginationData.nextCursors);
      const updatedQuery = await removeQueriesIfNoNextPage(
        query,
        lastResponse
      );
      deletedQueryCache.push(
        updatedQuery ? {
          query,
          cursors: paginationData.nextCursors
        } : null
      );
      if (updatedQuery) {
        query = updatedQuery;
      }
      inProgressRequest = fetch(
        query,
        {
          ...variables,
          ...paginationData.nextCursors
        },
        config$1
      ).finally(() => {
        inProgressRequest = null;
      });
      return inProgressRequest;
    }
    return null;
  };
  const handlePrev = async () => {
    if (inProgressRequest) {
      return inProgressRequest;
    }
    if (paginationData.hasPrevPage) {
      nextCursorsCache.pop();
      const { query: deletedQuery } = deletedQueryCache.pop() || {};
      let cachedCursors = {};
      let cursors = {};
      if (deletedQuery) {
        cachedCursors = nextCursorsCache.pop() || {};
        deletedQueryCache.pop();
        query = deletedQuery;
        cursors = { ...cachedCursors };
      } else {
        cursors = { ...cachedCursors, ...paginationData.prevCursors };
      }
      inProgressRequest = fetch(
        query,
        {
          ...variables,
          ...cursors
        },
        config$1
      ).finally(() => {
        inProgressRequest = null;
      });
      return inProgressRequest;
    }
    return null;
  };
  return fetch(query, variables, config$1);
}
export {
  fetchPaginatedQuery
};
