import { j as jsxRuntimeExports } from './../../external/react/jsx-runtime.js';
import { useRef, useState, useMemo, useCallback, useEffect } from "react";
import { fetchNFTAssetURL } from "./fetchNFTAssetURL.js";
import { Media } from "./Media.js";
import { getPreset, getUrlFromData } from "./utils.js";
import styles from "./styles.module.css.js";
import { debounce } from "../../utils/debounce.js";
import { getFromAssetCache } from "../../cache/assets.js";
const AssetContent = (props) => {
  const {
    chain = "ethereum",
    address,
    tokenId,
    loading,
    error,
    imgProps = {},
    videoProps = {},
    audioProps = {},
    preset: presetProp,
    progressCallback
  } = props;
  const ref = useRef(null);
  const loadingRef = useRef(false);
  const [preset, setPreset] = useState(() => {
    if (presetProp)
      return presetProp;
    return getPreset(ref.current);
  });
  const cachedData = useMemo(() => {
    const assetCache = getFromAssetCache(chain, address, tokenId);
    if (assetCache && assetCache.value) {
      return assetCache.value;
    }
  }, [chain, address, tokenId]);
  const [data, setData] = useState(cachedData);
  const [state, setState] = useState(
    cachedData ? "loaded" : "loading"
    /* Loading */
  );
  const updateState = useCallback(
    (stateVal) => {
      loadingRef.current = stateVal === "loading";
      setState((prevState) => {
        if (prevState != stateVal) {
          progressCallback && progressCallback(stateVal);
          return stateVal;
        }
        return prevState;
      });
    },
    [progressCallback]
  );
  const handleResize = useMemo(() => {
    return debounce(() => {
      const currentPreset = getPreset(ref.current);
      setPreset(currentPreset);
    });
  }, []);
  useEffect(() => {
    if (!presetProp) {
      setPreset(getPreset(ref.current));
    }
  }, [presetProp]);
  useEffect(() => {
    if (presetProp) {
      return;
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize, presetProp]);
  const url = getUrlFromData({ data, preset });
  const shouldFetch = state !== "error" && (!data || !url);
  useEffect(() => {
    if (!shouldFetch || loadingRef.current) {
      return;
    }
    updateState(
      "loading"
      /* Loading */
    );
    const forceFetch = Boolean(cachedData);
    fetchNFTAssetURL(chain, address, tokenId, forceFetch).then((res) => {
      const url2 = getUrlFromData({ data: res.value, preset });
      updateState(
        !url2 ? "error" : "loaded"
        /* Loaded */
      );
      setData(res.value);
    }).catch(() => {
      updateState(
        "error"
        /* Error */
      );
    });
  }, [address, chain, preset, tokenId, updateState, shouldFetch, cachedData]);
  if (state === "error") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: error || /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.error, children: "Error!" }) });
  }
  if (state === "loading") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: loading || /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.loading, children: "Loading..." }) });
  }
  if (url) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Media,
      {
        preset,
        imgProps,
        videoProps,
        audioProps,
        url,
        onError: () => {
          updateState(
            "error"
            /* Error */
          );
        },
        onComplete: () => updateState(
          "loaded"
          /* Loaded */
        )
      }
    );
  }
  return null;
};
export {
  AssetContent
};
