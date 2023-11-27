function getArgumentsFromInput(inputs, ctx, _key = "") {
  let data = [];
  inputs.forEach((input) => {
    var _a, _b, _c;
    let key = _key;
    if (input.kind === "ObjectField" && input.value.kind === "ObjectValue") {
      const _data = getArgumentsFromInput(
        input.value.fields,
        ctx,
        key += input.name.value + "/"
      );
      data = [...data, ..._data];
    } else {
      key += input.name.value;
      const name = input.name.value;
      let uniqueName = input.name.value;
      if (ctx.variableNamesMap[name]) {
        uniqueName = `${name}${ctx.variableNamesMap[name]}`;
        ctx.variableNamesMap[name]++;
      } else {
        ctx.variableNamesMap[name] = 1;
      }
      data.push({
        path: key.split("/"),
        name,
        uniqueName,
        valueKind: (_a = input.value) == null ? void 0 : _a.kind,
        // eslint-disable-next-line
        // @ts-ignore
        assignedVariable: (_c = (_b = input.value) == null ? void 0 : _b.name) == null ? void 0 : _c.value,
        defaultValue: input.value.value || input.value.values,
        ref: input
      });
    }
  });
  return data;
}
function createArgumentValue(value) {
  return {
    kind: "Variable",
    name: {
      kind: "Name",
      value
    }
  };
}
export {
  createArgumentValue,
  getArgumentsFromInput
};
