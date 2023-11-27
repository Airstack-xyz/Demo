import { Chain } from "../../constants";
import type { NFTAssetURL } from "../../types";
export interface AirstackAssetContextInterface {
    fetchCachedNFTAssetURL: (chain: Chain, address: string, tokenId: string) => NFTAssetURL;
    fetchNFTAssetURLs: (chain: Chain, address: string, tokenIds: Array<string>) => Promise<Record<string, NFTAssetURL>>;
    fetchNFTAssetURL: (chain: Chain, address: string, tokenId: string) => Promise<NFTAssetURL>;
}
export declare const fetchNFTAssetURL: (chain: Chain, address: string, tokenId: string, forceFetch?: boolean) => Promise<NFTAssetURL>;
