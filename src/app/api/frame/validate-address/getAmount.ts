import { getTokenDecimalsQuery } from '@/queries/frames/token';
import { fetchQuery } from '@airstack/airstack-react/apis/fetchQuery';
import { init } from '@airstack/airstack-react/init';
import {
  GetTokenDecimalsQueryVariables,
  GetTokenDecimalsQuery
} from '../../../../../__generated__/airstack-types';
import { API_KEY } from '../../contants';

async function getDecialsForToken(tokenAddress: string) {
  init(API_KEY);
  const variables: GetTokenDecimalsQueryVariables = {
    address: tokenAddress
  };
  const { data, error } = await fetchQuery<GetTokenDecimalsQuery>(
    getTokenDecimalsQuery,
    variables
  );

  if (error) {
    console.error(error);
    return null;
  }

  return data?.Tokens?.Token?.[0]?.decimals || null;
}

export async function getAmount(amount: number, tokenAddress: string) {
  const decimals = await getDecialsForToken(tokenAddress);
  if (!decimals) {
    return null;
  }
  return amount * 10 ** decimals;
}
