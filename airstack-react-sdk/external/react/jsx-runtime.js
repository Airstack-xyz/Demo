import { __module as jsxRuntime } from "../../_virtual/jsx-runtime.js";
import { __require as requireReactJsxRuntime_production_min } from "./cjs/react-jsx-runtime.production.min.js";
import { __require as requireReactJsxRuntime_development } from "./cjs/react-jsx-runtime.development.js";
if (process.env.NODE_ENV === "production") {
  jsxRuntime.exports = requireReactJsxRuntime_production_min();
} else {
  jsxRuntime.exports = requireReactJsxRuntime_development();
}
var jsxRuntimeExports = jsxRuntime.exports;
export {
  jsxRuntimeExports as j
};
