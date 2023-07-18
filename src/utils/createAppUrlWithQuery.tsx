const APP_EXPLORER_URL = 'https://app.airstack.xyz/explorer';

export function createAppUrlWithQuery(query: string, variables?: string) {
  const compressedQuery = btoa(query);
  const compressedVariables = variables ? btoa(variables) : '';
  return `${APP_EXPLORER_URL}?query=${compressedQuery}${
    variables ? `&variables=${compressedVariables}` : ''
  }`;
}
