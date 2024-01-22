import { truncateMentionLabel } from '../Components/Input/utils';

export type CreateFormattedRawInputArgument = {
  label: string;
  address: string;
  type: string;
  blockchain: string;
  truncateLabel?: boolean;
};

export function createFormattedRawInput({
  label,
  address,
  type,
  blockchain,
  truncateLabel
}: CreateFormattedRawInputArgument) {
  const displayLabel = truncateLabel ? truncateMentionLabel(label) : label;
  return `#⎱${displayLabel}⎱(${address} ${type} ${blockchain} null)`;
}
