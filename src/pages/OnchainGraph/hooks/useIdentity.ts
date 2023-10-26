import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useIdentity() {
  const [searchParams] = useSearchParams();
  return useMemo(() => {
    return searchParams.get('identity') || '';
  }, [searchParams]);
}
