const assetCache = {};
function getAssetCacheKey(chain, address, tokenId) {
  return `${chain}-${address.toLowerCase()}-${tokenId.toLowerCase()}`;
}
function addToAssetCache(chain, address, tokenId, content) {
  const key = getAssetCacheKey(chain, address, tokenId);
  assetCache[key] = content;
}
function getFromAssetCache(chain, address, tokenId) {
  const key = getAssetCacheKey(chain, address, tokenId);
  return assetCache[key];
}
export {
  addToAssetCache,
  getFromAssetCache
};
