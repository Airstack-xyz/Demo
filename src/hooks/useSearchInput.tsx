import { useSearchParams } from 'react-router-dom';

export function useSearchInput() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const tokeType = searchParams.get('tokeType') || '';
  return { query, tokeType };
}
