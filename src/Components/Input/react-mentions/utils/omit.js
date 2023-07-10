const omit = (obj, ...rest) => {
  const keys = [].concat(...rest);
  return Object.keys(obj).reduce((acc, k) => {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(k) && !keys.includes(k) && obj[k] !== undefined) {
      acc[k] = obj[k];
    }
    return acc;
  }, {});
};

export default omit;
