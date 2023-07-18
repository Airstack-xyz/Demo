export function createTokenHolderUrl(
  address: string,
  inputType: 'ADDRESS' | 'POAP' = 'ADDRESS'
) {
  return `/token-holders?address=${address}&rawInput=${address}&inputType=${inputType}`;
}
