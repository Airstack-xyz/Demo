import { j as jsxRuntimeExports } from './../../external/react/jsx-runtime.js';
import { useState, useRef, useCallback, useEffect } from "react";
import { getMediaTypeFromUrl, getMediaType } from "./utils.js";
import styles from "./styles.module.css.js";
import { logError } from "../../utils/log.js";
function Audio({ url, audioProps, onError }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "audio",
    {
      controls: true,
      className: styles.media,
      ...audioProps,
      onError: (error) => {
        onError();
        (audioProps == null ? void 0 : audioProps.onError) && audioProps.onError(error);
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("source", { src: url }),
        "Your browser does not support the audio tag."
      ]
    }
  );
}
function Video({ url, videoProps: elementProps, onError }) {
  const ref = useRef(null);
  const {
    maxDurationForAutoPlay = 10,
    onLoadedMetadata,
    ...videoProps
  } = elementProps || {};
  const handleMetadata = useCallback(
    (metadata) => {
      var _a;
      if (maxDurationForAutoPlay && ((_a = metadata.target) == null ? void 0 : _a.duration) < maxDurationForAutoPlay) {
        if (ref.current) {
          ref.current.play();
        }
      }
      if (onLoadedMetadata) {
        onLoadedMetadata(metadata);
      }
    },
    [maxDurationForAutoPlay, onLoadedMetadata]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "video",
    {
      loop: true,
      muted: true,
      controls: true,
      className: styles.media,
      ...videoProps,
      onLoadedMetadata: handleMetadata,
      ref,
      onError: (error) => {
        onError();
        (videoProps == null ? void 0 : videoProps.onError) && videoProps.onError(error);
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("source", { src: url }),
        "Your browser does not support the video tag."
      ]
    }
  );
}
function Media({
  preset,
  imgProps,
  videoProps,
  audioProps,
  onError,
  onComplete,
  url
}) {
  const [mediaType, setMediaType] = useState(null);
  const isLoadingRef = useRef(false);
  const handleUrlWithoutExtension = useCallback(
    async (url2) => {
      if (isLoadingRef.current)
        return;
      isLoadingRef.current = true;
      try {
        const type = await getMediaTypeFromUrl(url2);
        setMediaType(type);
        onComplete();
        if (type === "unknown") {
          logError("unknown media type", url2);
        }
      } catch (error) {
        logError(error);
      } finally {
        isLoadingRef.current = false;
      }
    },
    [onComplete]
  );
  useEffect(() => {
    if (url === null)
      return;
    const type = getMediaType(url);
    if (type === "unknown") {
      handleUrlWithoutExtension(url);
    } else {
      setMediaType(type);
      onComplete();
    }
  }, [handleUrlWithoutExtension, onComplete, url]);
  useEffect(() => {
    if (!url && mediaType) {
      logError("url is null");
      onError();
    }
  }, [mediaType, onError, preset, url]);
  useEffect(() => {
    if (mediaType === "html" || mediaType === "binary") {
      onError();
    }
  }, [mediaType, onError]);
  if (!mediaType || !url)
    return null;
  if (mediaType === "video") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { url, videoProps, onError });
  }
  if (mediaType === "audio") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Audio, { url, audioProps, onError });
  }
  if (mediaType === "html" || mediaType === "binary") {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "img",
    {
      alt: "NFT",
      className: styles.media,
      ...imgProps,
      src: url,
      onError: (error) => {
        onError();
        (imgProps == null ? void 0 : imgProps.onError) && imgProps.onError(error);
      }
    }
  );
}
export {
  Media
};
