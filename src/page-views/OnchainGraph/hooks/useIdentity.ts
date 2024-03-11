import useSearchParams from '@/hooks/useSearchParams';
import { useMemo } from 'react';

export function useIdentity() {
  const [searchParams] = useSearchParams();
  return useMemo(() => {
    return searchParams?.get('identity') || '';
  }, [searchParams]);
}
