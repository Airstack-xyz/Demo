import { config } from "./config.js";
function init(key, _config) {
  config.authKey = key;
  config.env = (_config == null ? void 0 : _config.env) || "dev";
  config.cache = (_config == null ? void 0 : _config.cache) === false ? false : true;
  config.cancelHookRequestsOnUnmount = (_config == null ? void 0 : _config.cancelHookRequestsOnUnmount) || false;
}
export {
  init
};
