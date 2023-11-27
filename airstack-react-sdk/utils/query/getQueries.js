function getQueries(query) {
  return query.definitions[0].selectionSet.selections;
}
export {
  getQueries
};
