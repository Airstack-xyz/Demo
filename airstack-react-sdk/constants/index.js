const AIRSTACK_ENDPOINT = "https://api.airstack.xyz/gql";
var PresetPXSize = /* @__PURE__ */ ((PresetPXSize2) => {
  PresetPXSize2[PresetPXSize2["ExtraSmall"] = 125] = "ExtraSmall";
  PresetPXSize2[PresetPXSize2["Small"] = 250] = "Small";
  PresetPXSize2[PresetPXSize2["Medium"] = 500] = "Medium";
  PresetPXSize2[PresetPXSize2["Large"] = 750] = "Large";
  return PresetPXSize2;
})(PresetPXSize || {});
const PresetArray = [
  125,
  250,
  500,
  750
  /* Large */
];
const API_ENDPOINT_PROD = "https://api.airstack.xyz/gql";
export {
  AIRSTACK_ENDPOINT,
  API_ENDPOINT_PROD,
  PresetArray,
  PresetPXSize
};
