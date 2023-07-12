import { useSearchParams } from 'react-router-dom';

export function useSearchInput() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const tokenType = searchParams.get('tokenType') || '';
  return { query, tokenType };
}
