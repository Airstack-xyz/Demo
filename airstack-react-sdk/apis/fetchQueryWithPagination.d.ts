import { Config, FetchPaginatedQueryReturnType, ResponseType, VariablesType } from "../types";
export declare function fetchQueryWithPagination<D = ResponseType>(query: string, variables?: VariablesType, config?: Config): FetchPaginatedQueryReturnType<D>;
