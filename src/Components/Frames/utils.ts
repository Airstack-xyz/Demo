import { encode } from '../../utils/encode';

export const encodeFrameData = (data: Record<string, string>) => {
  const stringifiedData = JSON.stringify(data);
  return encode(stringifiedData);
};

export const getProfileDisplayName = (address: string | undefined) => {
  if (!address) return address;

  if (address.startsWith('lens/@')) return address.replace('lens/@', '');
  if (address.startsWith('fc_fname:')) return address.replace('fc_fname:', '');

  return address;
};
