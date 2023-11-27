import { getQueriesWithLastPage } from "./findQueriesWithLastPage.js";
import { getQueries } from "./query/getQueries.js";
import { getIntrospectionQueryMap } from "./query/getIntrospectionQuery.js";
import { getArguments } from "./query/getArguments.js";
import { parse } from './../external/graphql/language/parser.js';
import { print } from './../external/graphql/language/printer.js';
function getVariables(query, schemaMap, ctx) {
  const { args } = getArguments(schemaMap, query, ctx);
  const variables = [];
  args.forEach((arg) => {
    if (arg.valueKind === "Variable") {
      variables.push(arg.assignedVariable || arg.uniqueName || arg.name);
    }
    if (arg.valueKind === "ListValue" && Array.isArray(arg.defaultValue)) {
      arg.defaultValue.forEach((value) => {
        if (value.kind === "Variable") {
          variables.push(value.name.value);
        }
      });
    }
  });
  return variables;
}
async function removeQueriesIfNoNextPage(query, data) {
  var _a;
  const queriesWithLastPage = getQueriesWithLastPage(data);
  if (Object.keys(queriesWithLastPage).length === 0)
    return null;
  const queryDocument = parse(query);
  const queries = getQueries(queryDocument);
  let variablesForRemainingQueryies = [];
  let variablesToDelete = [];
  const ctx = {
    variableNamesMap: {}
  };
  const schemaMap = await getIntrospectionQueryMap();
  queryDocument.definitions[0].selectionSet.selections = queries.filter((query2) => {
    var _a2;
    const queryName = query2.name.value;
    const aliasedQueryName = ((_a2 = query2 == null ? void 0 : query2.alias) == null ? void 0 : _a2.value) || "";
    const queryVariables = getVariables(query2, schemaMap, ctx);
    if (queriesWithLastPage[queryName] || queriesWithLastPage[aliasedQueryName]) {
      variablesToDelete = [...variablesToDelete, ...queryVariables];
      return false;
    }
    variablesForRemainingQueryies = [...variablesForRemainingQueryies, ...queryVariables];
    return true;
  });
  if (variablesToDelete.length === 0)
    return null;
  variablesToDelete = variablesToDelete.filter((deletedVariable) => {
    return !variablesForRemainingQueryies.find((remainingVariable) => {
      return remainingVariable === deletedVariable;
    });
  });
  const defination = queryDocument.definitions[0];
  defination.variableDefinitions = (_a = defination.variableDefinitions) == null ? void 0 : _a.filter(
    (variable) => {
      return !variablesToDelete.find((deletedVariable) => {
        return deletedVariable === variable.variable.name.value;
      });
    }
  );
  return print(queryDocument);
}
export {
  removeQueriesIfNoNextPage
};
