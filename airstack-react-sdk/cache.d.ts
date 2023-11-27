import { ResponseType, VariablesType } from "./types";
export declare function createCacheKey(query: string, variables?: VariablesType): string;
export declare function getFromCache<C extends ResponseType>(query: string, variables?: {}): C | null;
export declare function cacheResponse(response: ResponseType, query: string, variables?: {}): void;
