import { AIRSTACK_ENDPOINT } from "../../constants/index.js";
import { introspectionQuery } from "../../constants/introspectionQuery.js";
import { config } from "../../config.js";
const mismatchedQueryMap = {
  socialfollowingsinput: "socialfollowinginput",
  socialfollowersinput: "socialfollowerinput"
};
const cache = {
  schema: null
};
let inProgressRequest = null;
async function getIntrospectionQueryMap() {
  if (cache.schema) {
    return cache.schema;
  }
  if (inProgressRequest) {
    return inProgressRequest;
  }
  inProgressRequest = fetch(AIRSTACK_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: config.authKey
    },
    body: JSON.stringify({
      query: introspectionQuery,
      operationName: "IntrospectionQuery"
    })
  }).then((res) => res.json()).then((res) => {
    inProgressRequest = null;
    const schemaMap = {};
    res.data.__schema.types.forEach((type) => {
      schemaMap[type.name.toLowerCase()] = type;
    });
    for (const expectedQueryInputName in mismatchedQueryMap) {
      const actualQueryInputNameInResponse = mismatchedQueryMap[expectedQueryInputName];
      const value = schemaMap[expectedQueryInputName] || schemaMap[actualQueryInputNameInResponse];
      if (value) {
        schemaMap[expectedQueryInputName] = value;
      }
    }
    cache.schema = schemaMap;
    return schemaMap;
  });
  return inProgressRequest;
}
export {
  getIntrospectionQueryMap
};
