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
  label,
  truncateLabel
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
        blockchain,
        truncateLabel
      })
    }).toString()
  };
}
export function createTokenBalancesUrl({
  address,
  inputType = 'ADDRESS',
  blockchain,
  truncateLabel
}: Omit<CreateTokenHolderUrlArgument, 'label' | 'type'>) {
  return {
    pathname: '/token-balances',
    search: createSearchParams({
      address,
      blockchain,
      inputType,
      rawInput: createFormattedRawInput({
        type: 'ADDRESS',
        address,
        label: address,
        blockchain,
        truncateLabel
      })
    }).toString()
  };
}
