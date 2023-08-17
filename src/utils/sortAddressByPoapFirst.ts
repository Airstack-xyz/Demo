export function sortAddressByPoapFirst(array: string[]) {
  const notStartsWith0x: string[] = [];
  const startsWith0x: string[] = [];

  for (const item of array) {
    if (item.startsWith('0x')) {
      startsWith0x.push(item);
    } else {
      notStartsWith0x.push(item);
    }
  }

  return [...notStartsWith0x, ...startsWith0x];
}
