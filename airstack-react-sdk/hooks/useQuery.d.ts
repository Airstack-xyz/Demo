import { ConfigAndCallbacks, ResponseType, VariablesType } from "../types";
type UseQueryReturnType<D> = {
    data: D | null;
    error: any;
    loading: boolean;
    cancelRequest: () => void;
};
type UseLazyQueryReturnType<D extends ResponseType, Variables extends VariablesType> = [
    (variables?: Variables) => Promise<Omit<UseQueryReturnType<D>, "loading" | "cancelRequest">>,
    UseQueryReturnType<D>
];
export declare function useLazyQuery<ReturnedData = ResponseType, Variables extends VariablesType = VariablesType, Formatter extends (data: ResponseType) => ReturnedData = (data: ResponseType) => ReturnedData>(query: string, variables?: Variables, configAndCallbacks?: ConfigAndCallbacks<ReturnedData, Formatter>): UseLazyQueryReturnType<ReturnType<Formatter>, Variables>;
export declare function useQuery<ReturnedData = ResponseType, Variables extends VariablesType = VariablesType, Formatter extends (data: ResponseType) => ReturnedData = (data: ResponseType) => ReturnedData>(query: string, variables?: Variables, configAndCallbacks?: ConfigAndCallbacks<ReturnedData, Formatter>): UseQueryReturnType<ReturnedData>;
export {};
