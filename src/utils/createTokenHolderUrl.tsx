export function createTokenHolderUrl(address: string) {
  return `/token-holders?address=${address}&rawInput=${address}`;
}
