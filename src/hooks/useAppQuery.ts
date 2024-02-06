import { useCallback, useEffect, useRef, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';

const API = process.env.BFF_ENDPOINT || '';

if (!API) {
  // eslint-disable-next-line
  console.error('BFF_ENDPOINT is not defined');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAppQuery<Response = any, Variables = any>(query: string) {
  const auth = usePrivy();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<null | Response>(null);
  const [error, setError] = useState<null | string>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(
    () => () => {
      if (
        abortControllerRef.current &&
        !abortControllerRef.current.signal.aborted
      ) {
        abortControllerRef.current.abort();
      }
    },
    []
  );

  const fetchQuery = useCallback(
    async (variables?: Variables) => {
      if (abortControllerRef.current) {
        // abort previous request
        abortControllerRef.current.abort();
      }

      setLoading(true);
      setData(null);
      setError(null);

      let requestAborted = false;
      try {
        abortControllerRef.current = new AbortController();
        const token = await auth.getAccessToken();
        const res = await fetch(API, {
          method: 'POST',
          signal: abortControllerRef.current.signal,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            query,
            variables
          })
        });
        const json = await res.json();
        const data: Response = json?.data;
        if (json.errors) {
          setError('Unable to fetch overview data');
          return {
            data: null,
            error: json.errors
          };
        }

        if (data) {
          setData(data);
        }

        return {
          data,
          error: null
        };
      } catch (e) {
        if (e instanceof DOMException && e?.name === 'AbortError') {
          requestAborted = true;
          return {
            data: null,
            error: null
          };
        }
        setError('Unable to fetch overview data');
      } finally {
        abortControllerRef.current = null;
        if (!requestAborted) {
          setLoading(false);
        }
      }
      return {
        data: null,
        error: null
      };
    },
    [auth, query]
  );

  return [
    fetchQuery,
    {
      data,
      loading,
      error
    }
  ] as const;
}
