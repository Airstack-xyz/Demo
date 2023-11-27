function stringifyObjectValues(value) {
  const stringified = {};
  if (!value || typeof value !== "object")
    return value;
  for (const key in value) {
    if (Array.isArray(value[key])) {
      stringified[key] = value[key].map(
        (item) => stringifyObjectValues(item)
      );
    } else if (typeof value[key] === "object") {
      stringified[key] = JSON.stringify(value[key]);
    } else {
      stringified[key] = value[key];
    }
  }
  return stringified;
}
export {
  stringifyObjectValues
};
