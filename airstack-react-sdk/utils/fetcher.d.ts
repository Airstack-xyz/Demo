import { VariablesType } from "../types";
export declare function _fetch<ResponseType = any>(query: string, variables: VariablesType, abortController?: AbortController): Promise<[ResponseType | null, any]>;
export declare function fetchGql<ResponseType = any>(query: string, variables: VariablesType, abortController?: AbortController): Promise<[ResponseType | null, any]>;
