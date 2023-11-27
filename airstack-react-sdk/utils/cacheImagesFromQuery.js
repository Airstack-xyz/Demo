import { addToAssetCache } from "../cache/assets.js";
function cacheImagesWithTokenRecursive(data, tokenId, tokenAddress, blockchain, images) {
  if (!(data instanceof Object)) {
    return;
  }
  if (Array.isArray(data)) {
    for (const item of data) {
      cacheImagesWithTokenRecursive(
        item,
        tokenId,
        tokenAddress,
        blockchain,
        images
      );
    }
    return;
  }
  for (const key in data) {
    if (key === "blockchain") {
      blockchain = data[key];
    }
    if (key === "tokenId") {
      tokenId = data[key];
    }
    if (key === "tokenAddress") {
      tokenAddress = data[key];
    }
    if (key === "contentValue") {
      images = data[key];
    }
    if (blockchain && tokenId && tokenAddress && images) {
      addToAssetCache(blockchain, tokenAddress, tokenId, {
        type: "image",
        value: images
      });
      continue;
    }
    cacheImagesWithTokenRecursive(
      data[key],
      tokenId,
      tokenAddress,
      blockchain,
      images
    );
  }
}
function cacheImagesFromQuery(queries) {
  if (!queries)
    return;
  for (const queryName in queries) {
    const data = queries[queryName];
    for (const key in data) {
      if (!key.includes("pageInfo")) {
        cacheImagesWithTokenRecursive(data[key], null, null, null, null);
      }
    }
  }
}
export {
  cacheImagesFromQuery
};
