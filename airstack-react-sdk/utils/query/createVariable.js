import { Kind } from './../../external/graphql/language/kinds.js';
function getType(kind, value, required = false) {
  let type = {
    kind: "NamedType",
    name: {
      kind: "Name",
      value
    }
  };
  if (required) {
    type = {
      kind: "NonNullType",
      type: {
        ...type
      }
    };
  }
  if (kind === Kind.LIST) {
    type = {
      kind: "ListType",
      type: {
        ...type
      }
    };
  }
  return type;
}
function createVariable({
  type,
  isRequired,
  name,
  uniqueName,
  valueKind
}) {
  return {
    kind: "VariableDefinition",
    variable: {
      kind: "Variable",
      name: {
        kind: "Name",
        value: uniqueName || name
      }
    },
    type: getType(valueKind, type, isRequired),
    directives: []
  };
}
export {
  createVariable
};
