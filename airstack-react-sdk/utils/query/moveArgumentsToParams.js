import { createArgumentValue } from "./arguments.js";
import { createVariable } from "./createVariable.js";
function moveArgumentsToParams(query, args) {
  const definitions = query.definitions[0];
  args.forEach((input) => {
    if (input.type) {
      definitions.variableDefinitions.push(createVariable(input));
    }
  });
  args.forEach((input) => {
    input.ref.value = createArgumentValue(input.uniqueName || input.name);
  });
  return query;
}
export {
  moveArgumentsToParams
};
