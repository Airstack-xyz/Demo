import { Chain } from "../constants";
import { NFTAssetURL } from "../types";
export declare function addToAssetCache(chain: Chain, address: string, tokenId: string, content: NFTAssetURL): void;
export declare function getFromAssetCache(chain: Chain, address: string, tokenId: string): NFTAssetURL | undefined;
