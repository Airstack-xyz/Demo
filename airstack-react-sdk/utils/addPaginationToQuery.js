import { addCursorVariable } from "./addCursorVariable.js";
const cache = {};
async function addPaginationToQuery(query) {
  if (cache[query]) {
    return cache[query];
  }
  const _query = await addCursorVariable(query);
  if (_query !== query) {
    cache[query] = _query;
  }
  return _query;
}
export {
  addPaginationToQuery
};
