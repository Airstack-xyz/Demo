import { useState, useRef } from "react";
function noop() {
}
function defaultDataFormatter(data) {
  return data;
}
function useRequestState(variables, configAndCallbacks) {
  const {
    onCompleted = noop,
    onError = noop,
    dataFormatter = defaultDataFormatter,
    ...config
  } = configAndCallbacks || {};
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const configRef = useRef(config);
  const variablesRef = useRef(variables || {});
  const callbacksRef = useRef({
    onCompleted: noop,
    onError: noop,
    dataFormatter: defaultDataFormatter
  });
  const originalData = useRef(null);
  configRef.current.cancelRequestOnUnmount = config.cancelRequestOnUnmount;
  configRef.current.cache = config.cache;
  variablesRef.current = variables || {};
  callbacksRef.current = {
    ...callbacksRef.current,
    onCompleted,
    onError,
    dataFormatter
  };
  return {
    data,
    error,
    loading,
    setData,
    setError,
    setLoading,
    configRef,
    variablesRef,
    originalData,
    callbacksRef
  };
}
export {
  useRequestState
};
