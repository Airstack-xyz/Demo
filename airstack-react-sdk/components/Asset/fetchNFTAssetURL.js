import { getNftContent } from "../../apis/getNftContent.js";
import { getFromAssetCache, addToAssetCache } from "../../cache/assets.js";
const fetchNFTAssetURL = (chain, address, tokenId, forceFetch = false) => {
  return new Promise((resolve, reject) => {
    if (address.length === 0) {
      reject("invalid address");
      return;
    }
    if (tokenId.length === 0) {
      reject("invalid tokenId");
      return;
    }
    const nftAssetURL = getFromAssetCache(chain, address, tokenId);
    if (!forceFetch && nftAssetURL) {
      resolve(nftAssetURL);
    } else {
      getNftContent(chain, address, tokenId).then(([data, error]) => {
        const tokenNfts = (data == null ? void 0 : data.TokenNfts.TokenNft) || [];
        if (error || !(data == null ? void 0 : data.TokenNfts)) {
          reject(new Error("can't get the data"));
          return;
        }
        tokenNfts.forEach((token) => {
          const assetURLs = {
            type: token.contentType,
            value: token.contentValue
          };
          addToAssetCache(chain, address, token.tokenId, assetURLs);
        });
        const cache = getFromAssetCache(chain, address, tokenId);
        if (cache) {
          resolve(cache);
        } else {
          reject(new Error("nft content is not available"));
        }
      }).catch((err) => reject(err));
    }
  });
};
export {
  fetchNFTAssetURL
};
