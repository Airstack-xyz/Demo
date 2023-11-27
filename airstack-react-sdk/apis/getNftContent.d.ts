import { Chain } from "../constants";
import { type } from "../types";
export declare function getNftContent(chainId: Chain, address: string, tokenId: string): Promise<[type | null, any]>;
