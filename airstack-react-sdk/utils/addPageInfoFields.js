import { createPginationFieldAlias } from "./cursor.js";
function getPageInfo(cursorName) {
  return {
    kind: "Field",
    alias: {
      kind: "Name",
      value: createPginationFieldAlias(cursorName)
    },
    name: {
      kind: "Name",
      value: "pageInfo"
    },
    selectionSet: {
      kind: "SelectionSet",
      selections: [
        {
          kind: "Field",
          name: {
            kind: "Name",
            value: "prevCursor"
          }
        },
        {
          kind: "Field",
          name: {
            kind: "Name",
            value: "nextCursor"
          }
        }
      ]
    }
  };
}
function addPageInfoFields(query, cursorName) {
  var _a;
  const fields = (_a = query == null ? void 0 : query.selectionSet) == null ? void 0 : _a.selections;
  if (fields) {
    fields.push(getPageInfo(cursorName));
  }
}
export {
  addPageInfoFields
};
