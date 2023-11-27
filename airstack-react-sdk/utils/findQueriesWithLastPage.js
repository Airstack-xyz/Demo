import isAliasedPageInfo from "./cursor.js";
function getQueriesWithLastPage(data) {
  const queriesWithLastPage = {};
  for (const queryName in data) {
    const query = data[queryName];
    for (const key in query) {
      if (isAliasedPageInfo(key)) {
        const { nextCursor, prevCursor } = query[key];
        if (!nextCursor) {
          queriesWithLastPage[queryName] = {
            nextCursor,
            prevCursor
          };
        }
      }
    }
  }
  return queriesWithLastPage;
}
export {
  getQueriesWithLastPage
};
