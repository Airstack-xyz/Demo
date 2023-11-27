import { VariablesType, ConfigAndCallbacks, ResponseType } from "../types";
type BaseReturnType<D> = {
    data: null | D;
    error: any;
};
type Pagination = {
    hasNextPage: boolean;
    hasPrevPage: boolean;
    getNextPage: () => Promise<void>;
    getPrevPage: () => Promise<void>;
};
type UseQueryReturnType<D> = BaseReturnType<D> & {
    loading: boolean;
    pagination: Pagination;
    cancelRequest: () => void;
};
type FetchType<D extends ResponseType, V extends VariablesType> = (variables?: V) => Promise<BaseReturnType<D> & {
    pagination: Omit<Pagination, "getNextPage" | "getPrevPage">;
}>;
type LazyHookReturnType<D extends ResponseType, V extends VariablesType> = [
    FetchType<D, V>,
    UseQueryReturnType<D>
];
export declare function useLazyQueryWithPagination<ReturnedData = ResponseType, Variables extends VariablesType = VariablesType, Formatter extends (data: ResponseType) => ReturnedData = (data: ResponseType) => ReturnedData>(query: string, variables?: Variables, configAndCallbacks?: ConfigAndCallbacks<ReturnedData, Formatter>): LazyHookReturnType<ReturnType<Formatter>, Variables>;
export declare function useQueryWithPagination<ReturnedData = ResponseType, Variables extends VariablesType = VariablesType, Formatter extends (data: ResponseType) => ReturnedData = (data: ResponseType) => ReturnedData>(query: string, variables?: Variables, configAndCallbacks?: ConfigAndCallbacks<ReturnedData, Formatter>): UseQueryReturnType<ReturnType<Formatter>>;
export {};
