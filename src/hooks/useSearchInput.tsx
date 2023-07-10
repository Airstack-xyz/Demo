import { useSearchParams } from 'react-router-dom';

export function useSearchInput() {
  const [searchParams] = useSearchParams();
  return searchParams.get('query') || '';
}
