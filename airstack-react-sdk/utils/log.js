import { config } from "../config.js";
function logError(...params) {
  var _a;
  if (((_a = config) == null ? void 0 : _a.env) === "dev") {
    console.error(...params);
  }
}
export {
  logError
};
