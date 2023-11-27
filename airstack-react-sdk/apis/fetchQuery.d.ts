import { Config, FetchQueryReturnType, ResponseType, VariablesType } from "../types";
export declare function fetchQuery<D = ResponseType>(query: string, variables?: VariablesType, _config?: Config): FetchQueryReturnType<D>;
