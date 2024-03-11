export function debounce<T extends (...args: any) => void>(
  callback: T,
  timeout = 300
) {
  // eslint-disable-next-line
  let timer: any;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      // eslint-disable-next-line
      // @ts-ignore
      callback(...args);
    }, timeout);
  };
}
