function createPginationFieldAlias(cursorName) {
  return `pageInfo_${cursorName}`;
}
function isAliasedPageInfo(key) {
  return key.startsWith("pageInfo_");
}
function getCursorName(key) {
  return key.replace("pageInfo_", "");
}
export {
  createPginationFieldAlias,
  isAliasedPageInfo as default,
  getCursorName
};
