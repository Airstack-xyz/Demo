import { createSearchParams } from 'react-router-dom';
import {
  CreateFormattedRawInputArgument,
  createFormattedRawInput
} from './createQueryParamsWithMention';

type CreatechannelsUrlArgument = Pick<
  CreateFormattedRawInputArgument,
  'address' | 'label' | 'truncateLabel'
>;

export function createChannelsUrl({
  address,
  label,
  truncateLabel
}: CreatechannelsUrlArgument) {
  return {
    pathname: '/channels',
    search: createSearchParams({
      address,
      blockchain: '',
      inputType: 'address',
      tokenType: '',
      rawInput: createFormattedRawInput({
        type: '',
        address,
        label,
        blockchain: '',
        truncateLabel
      })
    }).toString()
  };
}
