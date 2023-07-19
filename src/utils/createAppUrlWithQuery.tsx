const APP_EXPLORER_URL = 'https://app.airstack.xyz/explorer';

export function createAppUrlWithQuery(
  query: string,
  // eslint-disable-next-line
  _variables?: Record<string, any>
) {
  const compressedQuery = btoa(query);
  const variables = _variables ? JSON.stringify(_variables) : '';
  const compressedVariables = variables ? btoa(variables) : '';
  return `${APP_EXPLORER_URL}?query=${compressedQuery}${
    variables ? `&variables=${compressedVariables}` : ''
  }`;
}
