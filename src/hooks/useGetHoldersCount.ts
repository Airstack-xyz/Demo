import { useCallback, useRef, useState } from 'react';
import { apiKey } from '../constants';
import { TokenHolders } from '../page-views/TokenHolders/types';
import { getOverviewQuery } from '../queries/overviewQuery';
import { TokenBlockchain } from '../types';

const HOLDERS_COUNT_ENDPOINT = 'https://api.beta.airstack.xyz/gql';

type HoldersCountResponse = {
  TokenHolders: TokenHolders;
};

type HoldersCountParams = {
  eventIds: string[];
} & {
  [Key in `${TokenBlockchain}Tokens`]: string[];
};

export function useGetHoldersCount() {
  const [data, setData] = useState<TokenHolders | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchHoldersCount = useCallback(async (data: HoldersCountParams) => {
    if (abortControllerRef.current) {
      // abort previous request
      abortControllerRef.current.abort();
    }

    setLoading(true);
    setData(null);
    setError(null);

    const variables: Partial<HoldersCountParams> = {};
    for (const key in data) {
      const value = data[key as keyof HoldersCountParams];
      if (value && value.length > 0) {
        variables[key as keyof HoldersCountParams] = value;
      }
    }

    let requestAborted = false;
    try {
      const query = getOverviewQuery({
        hasPolygon: Boolean(variables.polygonTokens?.length),
        hasEvents: Boolean(variables.eventIds?.length),
        hasEthereum: Boolean(variables.ethereumTokens?.length),
        hasBase: Boolean(variables.baseTokens?.length),
        hasZora: Boolean(variables.zoraTokens?.length)
      });

      abortControllerRef.current = new AbortController();

      const res = await fetch(HOLDERS_COUNT_ENDPOINT, {
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
      const data = json?.data as HoldersCountResponse;

      if (json.errors) {
        setError('Unable to fetch overview data');
        return;
      }
      if (data?.TokenHolders) {
        setData(data.TokenHolders);
      }
    } catch (err) {
      if (err instanceof DOMException && err?.name === 'AbortError') {
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

  return { fetch: fetchHoldersCount, data, loading, error };
}
