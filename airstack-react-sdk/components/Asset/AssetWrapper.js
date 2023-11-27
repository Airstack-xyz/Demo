import { j as jsxRuntimeExports } from './../../external/react/jsx-runtime.js';
import { useRef, useMemo } from "react";
import styles from "./styles.module.css.js";
import { useInViewportOnce } from "../../hooks/useInViewportOnce.js";
import { AssetContent } from "./Asset.js";
const Asset = (props) => {
  const {
    chain = "ethereum",
    address,
    tokenId,
    loading,
    error,
    imgProps,
    videoProps,
    audioProps,
    preset,
    progressCallback,
    containerClassName,
    ...containerProps
  } = props;
  const ref = useRef(null);
  const isInViewPort = useInViewportOnce(ref);
  const assetProps = useMemo(() => {
    return {
      chain,
      address,
      tokenId,
      loading,
      error,
      imgProps,
      videoProps,
      audioProps,
      preset,
      progressCallback
    };
  }, [
    address,
    audioProps,
    chain,
    error,
    imgProps,
    loading,
    preset,
    progressCallback,
    tokenId,
    videoProps
  ]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ...containerProps,
      ref,
      className: `${styles.container}${containerClassName ? " " + containerClassName : ""}`,
      children: isInViewPort && /* @__PURE__ */ jsxRuntimeExports.jsx(AssetContent, { ...assetProps })
    }
  );
};
export {
  Asset
};
