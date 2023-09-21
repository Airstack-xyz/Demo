const APP_EXPLORER_URL = 'https://app.uat.airstack.xyz/api-studio';

function encode(string: string) {
  try {
    const _string = btoa(string);
    return _string;
  } catch {
    return string;
  }
}

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
