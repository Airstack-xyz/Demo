import { encode } from './encode';

const APP_EXPLORER_URL = 'https://app.airstack.xyz/api-studio';

export function createAppUrlWithQuery(
  query: string,
  // eslint-disable-next-line
  _variables?: Record<string, any>
) {
  const compressedQuery = encode(query);
  const variables = _variables ? JSON.stringify(_variables) : '';
  const compressedVariables = variables ? encode(variables) : '';
  return `${APP_EXPLORER_URL}?autoRun=true&query=${compressedQuery}${
    variables ? `&variables=${compressedVariables}` : ''
  }`;
}
