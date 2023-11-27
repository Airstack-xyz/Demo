import { fetchGql } from "../utils/fetcher.js";
import { getFromCache, cacheResponse } from "../cache.js";
import { stringifyObjectValues } from "../utils/stringifyObjectValues.js";
import { config } from "../config.js";
import { cacheImagesFromQuery } from "../utils/cacheImagesFromQuery.js";
async function fetchQuery(query, variables, _config) {
  const _variables = stringifyObjectValues(variables || {});
  const config$1 = { ...config, ..._config };
  let data = config$1.cache ? getFromCache(query, _variables || {}) : null;
  let error = null;
  if (!data) {
    const [response, _error] = await fetchGql(
      query,
      _variables,
      _config == null ? void 0 : _config.abortController
    );
    data = response;
    error = _error;
    if (config$1.cache && data && !error) {
      cacheResponse(data, query, _variables);
    }
    cacheImagesFromQuery(data);
  } else {
    data = { ...data };
  }
  return {
    data,
    error
  };
}
export {
  fetchQuery
};
