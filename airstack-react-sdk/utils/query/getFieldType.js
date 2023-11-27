function getFieldType(schemaMap, fields, path, index = 0) {
  var _a, _b, _c, _d, _e;
  if (index === path.length) {
    console.error(" unable to find the type of ", path.join("/"));
    return [null, false];
  }
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    const kind = (_a = field == null ? void 0 : field.type) == null ? void 0 : _a.kind;
    if (field.name === path[index]) {
      const ofType = field.type.ofType;
      if (kind === "SCALAR" || kind === "ENUM") {
        return [field.type.name, false];
      }
      if (ofType && (ofType.kind === "SCALAR" || ofType.kind === "ENUM")) {
        return [ofType.name, kind === "NON_NULL"];
      }
      let _ofType = ofType;
      while (_ofType) {
        if (
          // eslint-disable-next-line
          // @ts-ignore
          _ofType.ofType
        ) {
          if (
            // eslint-disable-next-line
            // @ts-ignore
            _ofType.ofType.kind !== "SCALAR" || // eslint-disable-next-line
            // @ts-ignore
            _ofType.ofType.kind !== "ENUM"
          ) {
            break;
          }
          _ofType = _ofType.ofType;
        } else {
          break;
        }
      }
      if (
        // eslint-disable-next-line
        // @ts-ignore
        ((_b = _ofType == null ? void 0 : _ofType.ofType) == null ? void 0 : _b.kind) === "SCALAR" || // eslint-disable-next-line
        // @ts-ignore
        ((_c = _ofType == null ? void 0 : _ofType.ofType) == null ? void 0 : _c.kind) === "ENUM"
      ) {
        return [_ofType.ofType.name, _ofType.kind === "NON_NULL"];
      }
      let name = (_ofType == null ? void 0 : _ofType.name) || ((_d = _ofType == null ? void 0 : _ofType.ofType) == null ? void 0 : _d.name) || ((_e = field == null ? void 0 : field.type) == null ? void 0 : _e.name);
      name = name.toLowerCase();
      const nestedFields = schemaMap[name].inputFields;
      return getFieldType(schemaMap, nestedFields, path, index + 1);
    }
  }
  return [null, false];
}
export {
  getFieldType
};
