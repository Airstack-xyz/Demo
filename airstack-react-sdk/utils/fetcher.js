import { createCacheKey } from "../cache.js";
import { config } from "../config.js";
import { AIRSTACK_ENDPOINT } from "../constants/index.js";
async function _fetch(query, variables, abortController) {
  if (!config.authKey) {
    throw new Error("No API key provided");
  }
  try {
    const res = await fetch(AIRSTACK_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: config.authKey
      },
      signal: abortController ? abortController == null ? void 0 : abortController.signal : null,
      body: JSON.stringify({
        query,
        variables
      })
    });
    const json = await res.json();
    const data = json == null ? void 0 : json.data;
    let error = null;
    if (json == null ? void 0 : json.errors) {
      error = json == null ? void 0 : json.errors;
    }
    return [data, error];
  } catch (error) {
    return [
      null,
      (error == null ? void 0 : error.message) || "Unable to fetch data"
    ];
  }
}
const promiseCache = {};
async function fetchGql(query, variables, abortController) {
  var _a;
  const key = createCacheKey(query, variables);
  const cached = promiseCache[key];
  if (!cached || ((_a = cached == null ? void 0 : cached.abortController) == null ? void 0 : _a.signal.aborted)) {
    const promise = _fetch(
      query,
      variables,
      abortController
    ).finally(() => {
      delete promiseCache[key];
    });
    promiseCache[key] = { promise, abortController };
  }
  return promiseCache[key].promise;
}
export {
  _fetch,
  fetchGql
};
