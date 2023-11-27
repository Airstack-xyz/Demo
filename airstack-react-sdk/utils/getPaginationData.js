import isAliasedPageInfo, { getCursorName } from "./cursor.js";
function getPaginationData(_response) {
  const nextCursors = {};
  const prevCursors = {};
  let hasNextPage = false;
  let hasPrevPage = false;
  const response = _response || {};
  for (const queryName in response) {
    const query = response[queryName];
    for (const key in query) {
      if (isAliasedPageInfo(key)) {
        const { nextCursor, prevCursor } = query[key];
        if (nextCursor) {
          nextCursors[getCursorName(key)] = nextCursor;
        }
        if (prevCursor) {
          prevCursors[getCursorName(key)] = prevCursor;
        }
        if (!hasNextPage) {
          hasNextPage = Boolean(nextCursor);
        }
        if (!hasPrevPage) {
          hasPrevPage = Boolean(prevCursor);
        }
      }
    }
  }
  return {
    nextCursors,
    prevCursors,
    hasNextPage,
    hasPrevPage
  };
}
export {
  getPaginationData
};
