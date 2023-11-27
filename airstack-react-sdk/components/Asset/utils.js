import { PresetPXSize, PresetArray } from "../../constants/index.js";
function getMediaType(media) {
  const imageRegex = /\.(jpe?g|png|webp|gif|bmp|svg)$/i;
  const videoRegex = /\.(mp4|webm|avi|mov|mwv|mkv|ogv)$/i;
  const audioRegex = /\.(mp3|wav|aac|ogg|wma|aiff)$/i;
  const htmlRegex = /\.html$/i;
  if (imageRegex.test(media)) {
    return "image";
  }
  if (videoRegex.test(media)) {
    return "video";
  }
  if (audioRegex.test(media)) {
    return "audio";
  }
  if (htmlRegex.test(media)) {
    return "html";
  }
  return "unknown";
}
function getSize(el) {
  let height = 0;
  let width = 0;
  if (el) {
    height = el.clientHeight;
    width = el.clientWidth;
  }
  return { height, width };
}
function getPreset(el) {
  const { width } = getSize(el);
  const closest = PresetArray.reduce((prev, curr) => {
    return Math.abs(curr - width) < Math.abs(prev - width) ? curr : prev;
  });
  switch (closest) {
    case PresetPXSize.ExtraSmall:
      return "extraSmall";
    case PresetPXSize.Small:
      return "small";
    case PresetPXSize.Medium:
      return "medium";
    case PresetPXSize.Large:
      return "large";
    default:
      return "original";
  }
}
async function getMediaTypeFromUrl(url) {
  if (!url) {
    return "unknown";
  }
  const response = await fetch(url, {
    method: "HEAD"
  });
  const contentType = response.headers.get("content-type");
  if (contentType == null ? void 0 : contentType.includes("image")) {
    return "image";
  }
  if (contentType == null ? void 0 : contentType.includes("video")) {
    return "video";
  }
  if (contentType == null ? void 0 : contentType.includes("audio")) {
    return "audio";
  }
  if (contentType == null ? void 0 : contentType.includes("octet-stream")) {
    return "binary";
  }
  return "unknown";
}
function getUrlFromData({
  data,
  preset
}) {
  var _a, _b, _c;
  if (!data)
    return null;
  return ((_a = data.animation_url) == null ? void 0 : _a.original) || ((_b = data.video) == null ? void 0 : _b.original) || ((_c = data.audio) == null ? void 0 : _c.original) || (data.image || {})[preset] || "";
}
export {
  getMediaType,
  getMediaTypeFromUrl,
  getPreset,
  getSize,
  getUrlFromData
};
