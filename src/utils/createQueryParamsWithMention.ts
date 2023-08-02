export type CreateFormattedRawInputArgument = {
  label: string;
  address: string;
  type: string;
  blockchain: string;
};

export function createFormattedRawInput({
  label,
  address,
  type,
  blockchain
}: CreateFormattedRawInputArgument) {
  return `#⎱${label}⎱(${address} ${type} ${blockchain} null)`;
}
