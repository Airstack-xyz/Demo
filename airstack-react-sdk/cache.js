const CACHE_EXPIRATION = 1e3 * 60;
const cache = {};
function createCacheKey(query, variables = {}) {
  let key = `${query}=`;
  const keys = Object.keys(variables).sort();
  for (const k of keys) {
    key += `${k}:${variables[k]} `;
  }
  return key.trim();
}
function isCacheValid(createdAt) {
  return Date.now() - createdAt < CACHE_EXPIRATION;
}
function getFromCache(query, variables = {}) {
  const key = createCacheKey(query, variables);
  const cachedData = cache[key];
  if (!cachedData)
    return null;
  const isValidCache = isCacheValid(cachedData.createdAt);
  return isValidCache ? cachedData.data : null;
}
function cacheResponse(response, query, variables = {}) {
  const key = createCacheKey(query, variables);
  cache[key] = {
    data: response,
    createdAt: Date.now()
  };
}
export {
  cacheResponse,
  createCacheKey,
  getFromCache
};
