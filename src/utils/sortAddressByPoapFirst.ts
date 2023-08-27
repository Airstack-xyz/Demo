import { TokenAddress } from '../pages/TokenHolders/types';

export function sortAddressByPoapFirst(array: TokenAddress[]) {
  const notStartsWith0x: TokenAddress[] = [];
  const startsWith0x: TokenAddress[] = [];

  for (const item of array) {
    if (item.address.startsWith('0x')) {
      startsWith0x.push(item);
    } else {
      notStartsWith0x.push(item);
    }
  }

  return [...notStartsWith0x, ...startsWith0x];
}
