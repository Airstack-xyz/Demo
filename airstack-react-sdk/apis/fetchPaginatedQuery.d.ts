import { Config, FetchPaginatedQueryReturnType, ResponseType, VariablesType } from "../types";
export declare function fetchPaginatedQuery<D = ResponseType>(originalQuery: string, variables?: VariablesType, config?: Config): FetchPaginatedQueryReturnType<D>;
