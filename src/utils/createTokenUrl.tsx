import { createSearchParams } from 'react-router-dom';
import {
  CreateFormattedRawInputArgument,
  createFormattedRawInput
} from './createQueryParamsWithMention';

type CreateTokenHolderUrlArgument = CreateFormattedRawInputArgument & {
  inputType?: 'ADDRESS' | 'POAP';
};

export function createTokenHolderUrl({
  address,
  inputType = 'ADDRESS',
  blockchain,
  type,
  label
}: CreateTokenHolderUrlArgument) {
  return {
    pathname: '/token-holders',
    search: createSearchParams({
      address,
      blockchain,
      inputType,
      tokenType: type,
      rawInput: createFormattedRawInput({
        type,
        address,
        label,
        blockchain
      })
    }).toString()
  };
}
