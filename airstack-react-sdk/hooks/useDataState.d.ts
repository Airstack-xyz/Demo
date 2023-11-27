/// <reference types="react" />
import { ConfigAndCallbacks, ResponseType, VariablesType } from "../types";
export declare function useRequestState<ReturnedData extends ResponseType, Variables, Formatter>(variables?: Variables, configAndCallbacks?: ConfigAndCallbacks<ReturnedData, Formatter>): {
    data: ReturnedData | null;
    error: null;
    loading: boolean;
    setData: import("react").Dispatch<import("react").SetStateAction<ReturnedData | null>>;
    setError: import("react").Dispatch<import("react").SetStateAction<null>>;
    setLoading: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    configRef: import("react").MutableRefObject<Pick<ConfigAndCallbacks<ReturnedData, Formatter>, "cache" | "abortController" | "cancelRequestOnUnmount">>;
    variablesRef: import("react").MutableRefObject<VariablesType>;
    originalData: import("react").MutableRefObject<any>;
    callbacksRef: import("react").MutableRefObject<Required<Omit<ConfigAndCallbacks<ReturnedData, Formatter>, "cache" | "abortController" | "cancelRequestOnUnmount">>>;
};
