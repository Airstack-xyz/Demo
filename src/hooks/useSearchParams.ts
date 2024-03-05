import {
  usePathname,
  useRouter,
  useSearchParams as useSearchParamsNext
} from 'next/navigation';

export default function useSearchParams<T = {}>() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParamsNext()!;
  const urlSearchParams = new URLSearchParams(
    Array.from(searchParams ? searchParams.entries() : [])
  );

  function setQueryParams(params: Partial<T>, _?: { replace?: boolean }) {
    Object.entries(params).forEach(([key, value]) => {
      urlSearchParams.set(key, String(value));
    });

    const search = urlSearchParams.toString();
    const query = search ? `?${search}` : '';

    router.push(`${pathname}${query}`);
  }

  return [searchParams, setQueryParams] as const;
}
