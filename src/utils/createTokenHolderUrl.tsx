export function createTokenHolderUrl({
  address,
  inputType = 'ADDRESS',
  tokenType = '-'
}: {
  address: string;
  inputType?: 'ADDRESS' | 'POAP';
  tokenType?: string;
}) {
  return `/token-holders?address=${address}&rawInput=${address}&inputType=${inputType}&tokenType=${tokenType}`;
}
