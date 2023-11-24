import { useCallback, useRef, useState } from 'react';
import { apiKey } from '../constants';
import { getOverviewQuery } from '../queries/overviewQuery';
import { OverviewData } from '../pages/TokenHolders/types';

const API = 'https://api.beta.airstack.xyz/gql';

type Variable = {
  polygonTokens: string[];
  eventIds: string[];
  ethereumTokens: string[];
  baseTokens: string[];
};

export function useGetTokenOverview() {
  const [data, setData] = useState<null | OverviewData['TokenHolders']>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchTokenOverview = useCallback(async (data: Variable) => {
    if (abortControllerRef.current) {
      // abort previous request
      abortControllerRef.current.abort();
    }

    setLoading(true);
    setData(null);
    setError(null);

    const variables: Partial<Variable> = {};
    for (const key in data) {
      const value = data[key as keyof Variable];
      if (value && value.length > 0) {
        variables[key as keyof Variable] = value;
      }
    }

    let requestAborted = false;
    try {
      const query = getOverviewQuery({
        hasPolygon: !!variables.polygonTokens?.length,
        hasEvents: !!variables.eventIds?.length,
        hasEthereum: !!variables.ethereumTokens?.length,
        hasBase: !!variables.baseTokens?.length
      });
      abortControllerRef.current = new AbortController();
      const res = await fetch(API, {
        method: 'POST',
        signal: abortControllerRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: apiKey
        },
        body: JSON.stringify({
          query,
          variables
        })
      });
      const json = await res.json();
      const data: OverviewData = json?.data;
      if (json.errors) {
        setError('Unable to fetch overview data');
        return;
      }

      if (data?.TokenHolders) {
        setData(data?.TokenHolders);
      }
    } catch (e) {
      if (e instanceof DOMException && e?.name === 'AbortError') {
        requestAborted = true;
        return;
      }
      setError('Unable to fetch overview data');
    } finally {
      abortControllerRef.current = null;
      if (!requestAborted) {
        setLoading(false);
      }
    }
  }, []);
  return { fetch: fetchTokenOverview, data, loading, error };
}
