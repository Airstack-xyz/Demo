const isBrowser = typeof window !== 'undefined';
export function encode(string: string) {
  if (isBrowser && !window.btoa) {
    return string;
  }
  try {
    const _string = btoa(string);
    return _string;
  } catch {
    return string;
  }
}

export function decode(value: string | string[]): string {
  const string = Array.isArray(value) ? value[0] : value;
  try {
    return isBrowser ? window.atob(string) : '';
  } catch {
    // eslint-disable-next-line no-console
    console.error('Failed to decode string', string);
    return '';
  }
}
