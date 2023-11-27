import { getArgumentsFromInput } from "./arguments.js";
import { getFieldType } from "./getFieldType.js";
function getArguments(schemaMap, fieldNode, ctx) {
  var _a;
  const queryName = fieldNode.name.value;
  const queryInputTypeName = queryName.toLowerCase() + "input";
  const queryInputType = schemaMap[queryInputTypeName];
  const input = (_a = fieldNode.arguments) == null ? void 0 : _a.find((a) => a.name.value === "input");
  const inputFields = (input == null ? void 0 : input.value).fields;
  queryInputType == null ? void 0 : queryInputType.inputFields.forEach(
    (inputField) => {
      const inputName = inputField.name;
      inputFields.find(
        (arg) => arg.value.kind !== "Variable" && arg.name.value === inputName
      );
    }
  );
  const args = getArgumentsFromInput(inputFields, ctx);
  args.forEach((input2) => {
    const [type, isRequied] = getFieldType(
      schemaMap,
      queryInputType.inputFields,
      input2.path
    );
    input2.type = type;
    input2.isRequired = isRequied;
  });
  return {
    args,
    inputFields
  };
}
export {
  getArguments
};
