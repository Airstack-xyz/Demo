import { useCallback, useEffect } from "react";
import { fetchQuery } from "../apis/fetchQuery.js";
import { useRequestState } from "./useDataState.js";
import { config } from "../config.js";
function useLazyQuery(query, variables, configAndCallbacks) {
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
  const { cancelRequestOnUnmount } = configRef.current || {};
  const shouldCancelRequestOnUnmount = cancelRequestOnUnmount === void 0 ? config.cancelHookRequestsOnUnmount : cancelRequestOnUnmount;
  const handleResponse = useCallback(
    (response, abortController) => {
      const isResponseForAbortedRequest = abortController.signal.aborted;
      const res = isResponseForAbortedRequest ? null : response;
      let data2 = null;
      let error2 = null;
      if (res) {
        const { data: rawData, error: _error } = res;
        originalData.current = rawData;
        data2 = rawData ? callbacksRef.current.dataFormatter(
          rawData
        ) : null;
        error2 = _error;
      }
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
        error: error2
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
  const fetch = useCallback(
    async (_variables) => {
      const abortController = !configRef.current.abortController || configRef.current.abortController.signal.aborted ? new AbortController() : configRef.current.abortController;
      configRef.current.abortController = abortController;
      setError(null);
      setLoading(true);
      const response = await fetchQuery(
        query,
        _variables || variablesRef.current,
        { ...configRef.current, abortController }
      );
      return handleResponse(response, abortController);
    },
    [setError, setLoading, query, variablesRef, configRef, handleResponse]
  );
  useEffect(() => abortRequest, [abortRequest]);
  return [fetch, { data, error, loading, cancelRequest }];
}
function useQuery(query, variables, configAndCallbacks) {
  const [fetch, { data, error, loading, cancelRequest }] = useLazyQuery(query, variables, configAndCallbacks);
  useEffect(() => {
    fetch();
  }, [fetch]);
  return { data, error, loading, cancelRequest };
}
export {
  useLazyQuery,
  useQuery
};
