import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useRequestState } from "./useDataState.js";
import { addPaginationToQuery } from "../utils/addPaginationToQuery.js";
import { fetchPaginatedQuery } from "../apis/fetchPaginatedQuery.js";
import { config } from "../config.js";
function useLazyQueryWithPagination(query, variables, configAndCallbacks) {
  const {
    data,
    error,
    loading,
    configRef,
    callbacksRef,
    originalData,
    variablesRef,
    setData,
    setError,
    setLoading
  } = useRequestState(
    variables,
    configAndCallbacks
  );
  const [hasNextPage, setHasNextPage] = useState(false);
  const hasNextPageRef = useRef(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const hasPrevPageRef = useRef(false);
  const nextRef = useRef(null);
  const prevRef = useRef(null);
  const { cancelRequestOnUnmount } = configRef.current || {};
  const shouldCancelRequestOnUnmount = cancelRequestOnUnmount === void 0 ? config.cancelHookRequestsOnUnmount : cancelRequestOnUnmount;
  const reset = useCallback(() => {
    nextRef.current = null;
    prevRef.current = null;
    setData(null);
    setError(null);
    setLoading(false);
    hasNextPageRef.current = false;
    setHasNextPage(false);
    hasPrevPageRef.current = false;
    setHasPrevPage(false);
  }, [setData, setError, setLoading]);
  const handleResponse = useCallback(
    (response, abortController) => {
      const isResponseForAbortedRequest = abortController.signal.aborted;
      const res = isResponseForAbortedRequest ? null : response;
      let data2 = null;
      let error2 = null;
      let hasNextPage2 = isResponseForAbortedRequest ? hasNextPageRef.current : false;
      let hasPrevPage2 = isResponseForAbortedRequest ? hasPrevPageRef.current : false;
      if (res) {
        const { data: rawData, getNextPage: getNextPage2, getPrevPage: getPrevPage2 } = res;
        nextRef.current = getNextPage2;
        prevRef.current = getPrevPage2;
        originalData.current = rawData;
        data2 = rawData ? callbacksRef.current.dataFormatter(
          rawData
        ) : null;
        error2 = res.error;
        hasNextPage2 = res.hasNextPage;
        hasPrevPage2 = res.hasPrevPage;
      }
      hasNextPageRef.current = hasNextPage2;
      setHasNextPage(hasNextPage2);
      hasPrevPageRef.current = hasPrevPage2;
      setHasPrevPage(hasPrevPage2);
      if (!isResponseForAbortedRequest) {
        setData(data2);
        setError(error2);
        if (error2) {
          callbacksRef.current.onError(error2);
        } else {
          callbacksRef.current.onCompleted(data2);
        }
      }
      setLoading(false);
      return {
        data: data2,
        error: error2,
        pagination: {
          hasNextPage: hasNextPage2,
          hasPrevPage: hasPrevPage2
        }
      };
    },
    [callbacksRef, originalData, setData, setError, setLoading]
  );
  const abortRequest = useCallback(() => {
    if (configRef.current.abortController && shouldCancelRequestOnUnmount) {
      configRef.current.abortController.abort();
    }
  }, [configRef, shouldCancelRequestOnUnmount]);
  const cancelRequest = useCallback(() => {
    if (configRef.current.abortController) {
      configRef.current.abortController.abort();
    }
  }, [configRef]);
  const updateAbortController = useCallback(() => {
    const abortController = !configRef.current.abortController || configRef.current.abortController.signal.aborted ? new AbortController() : configRef.current.abortController;
    configRef.current.abortController = abortController;
    return abortController;
  }, [configRef]);
  const fetch = useCallback(
    async (_variables) => {
      reset();
      const abortController = updateAbortController();
      setLoading(true);
      const queryWithPagination = await addPaginationToQuery(query);
      const res = await fetchPaginatedQuery(
        queryWithPagination,
        _variables || variablesRef.current,
        // always pass the whole config object to fetchPaginatedQuery
        // this is nessasary because fetchPaginatedQuery will use the abortController from the config object
        // and this also helps us to change the abortController
        // in case user aborts the next/prev page request and then makes a new request next/prev page request
        configRef.current
      );
      return handleResponse(res, abortController);
    },
    [
      configRef,
      handleResponse,
      query,
      reset,
      setLoading,
      updateAbortController,
      variablesRef
    ]
  );
  const getNextPage = useCallback(async () => {
    if (!nextRef.current)
      return;
    const abortController = updateAbortController();
    setLoading(true);
    const res = await nextRef.current();
    handleResponse(res, abortController);
  }, [handleResponse, setLoading, updateAbortController]);
  const getPrevPage = useCallback(async () => {
    if (!prevRef.current)
      return;
    const abortController = updateAbortController();
    setLoading(true);
    const res = await prevRef.current();
    handleResponse(res, abortController);
  }, [handleResponse, setLoading, updateAbortController]);
  useEffect(() => abortRequest, [abortRequest]);
  return useMemo(() => {
    return [
      fetch,
      {
        data,
        error,
        loading,
        pagination: {
          hasNextPage,
          hasPrevPage,
          getNextPage,
          getPrevPage
        },
        cancelRequest
      }
    ];
  }, [
    cancelRequest,
    data,
    error,
    fetch,
    getNextPage,
    getPrevPage,
    hasNextPage,
    hasPrevPage,
    loading
  ]);
}
function useQueryWithPagination(query, variables, configAndCallbacks) {
  const [fetch, data] = useLazyQueryWithPagination(query, variables, configAndCallbacks);
  useEffect(() => {
    fetch();
  }, [fetch]);
  return data;
}
export {
  useLazyQueryWithPagination,
  useQueryWithPagination
};
