import { getArguments } from "./query/getArguments.js";
import { moveArgumentsToParams } from "./query/moveArgumentsToParams.js";
import { getIntrospectionQueryMap } from "./query/getIntrospectionQuery.js";
import { getQueries } from "./query/getQueries.js";
import { addPageInfoFields } from "./addPageInfoFields.js";
import { config } from "../config.js";
import { parse } from './../external/graphql/language/parser.js';
import { print } from './../external/graphql/language/printer.js';
function getQueriesWithoutCursorAndUpdateContext(queries, schemaMap, globalCtx) {
  const queriesWithCursor = [];
  queries.forEach((query) => {
    const { args, inputFields } = getArguments(schemaMap, query, {
      variableNamesMap: {}
    });
    const cursor = args.find((arg) => arg.name === "cursor");
    const queryName = query.name.value;
    if (!cursor) {
      queriesWithCursor.push({
        queryName,
        inputFields,
        query
      });
      return;
    }
    if (cursor.valueKind !== "Variable")
      return;
    const variableName = cursor.assignedVariable || cursor.uniqueName || cursor.name;
    addPageInfoFields(query, variableName);
    globalCtx.variableNamesMap[variableName] = (globalCtx.variableNamesMap[variableName] || 0) + 1;
  });
  return queriesWithCursor;
}
async function addVariable(queryString, callback) {
  try {
    const schemaMap = await getIntrospectionQueryMap();
    const queryDocument = parse(queryString);
    const queries = getQueries(queryDocument);
    const globalCtx = {
      variableNamesMap: {}
    };
    const queriesWithoutCursor = getQueriesWithoutCursorAndUpdateContext(
      queries,
      schemaMap,
      globalCtx
    );
    queriesWithoutCursor.forEach(({ queryName, inputFields, query }) => {
      const queryInputTypeName = queryName.toLowerCase() + "input";
      const queryInputType = schemaMap[queryInputTypeName];
      const querySupportsCursor = queryInputType.inputFields.find(
        (field) => field.name === "cursor"
      );
      if (!querySupportsCursor) {
        if (config.env === "dev") {
          console.error(`query "${queryName}" does not support pagination.`);
        }
        return;
      }
      inputFields.push({
        kind: "ObjectField",
        name: {
          kind: "Name",
          value: "cursor"
        },
        value: {
          kind: "StringValue"
        }
      });
      const { args: argsWithCursor } = getArguments(
        schemaMap,
        query,
        globalCtx
      );
      const cursor = argsWithCursor.find((arg) => arg.name === "cursor");
      if (!cursor) {
        return;
      }
      moveArgumentsToParams(queryDocument, [cursor]);
      addPageInfoFields(query, cursor.uniqueName || cursor.name);
    });
    const updatedQueryString = print(queryDocument);
    callback(updatedQueryString);
  } catch (error) {
    if (config.env === "dev") {
      console.error(
        "unable to add cursor to query, please make sure the query is valid"
      );
    }
    console.error(error);
    callback(queryString);
  }
}
const promiseCache = {};
async function addCursorVariable(queryString) {
  const cachedPromise = promiseCache[queryString];
  if (cachedPromise)
    return cachedPromise;
  promiseCache[queryString] = new Promise(
    (resolve) => addVariable(queryString, (query) => {
      resolve(query);
      delete promiseCache[queryString];
    })
  );
  return promiseCache[queryString];
}
export {
  addCursorVariable
};
