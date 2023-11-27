import { useEffect } from "react";
import { init } from "./init.js";
function AirstackProvider({ children, apiKey, ...config }) {
  useEffect(() => {
    init(apiKey, config);
  }, [apiKey, config]);
  return children;
}
export {
  AirstackProvider
};
