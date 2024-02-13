export function encode(string: string) {
  if (!window.btoa) {
    return string;
  }
  try {
    const _string = btoa(string);
    return _string;
  } catch {
    return string;
  }
}
