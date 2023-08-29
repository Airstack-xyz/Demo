import { useCallback, useState } from 'react';
import { apiKey } from '../constants';
import {
  MultiPoapsOverviewQuery,
  MultiTokenOverviewQuery
} from '../queries/tokensQuery';

const API = 'https://api.beta.airstack.xyz/gql';

export function useGetTokenOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const fetchTokenOverview = useCallback(
    async (tokenAddress: string[], isPoap = false) => {
      setLoading(true);
      try {
        const query = isPoap
          ? MultiPoapsOverviewQuery
          : MultiTokenOverviewQuery;
        const variables = isPoap ? { eventId: tokenAddress } : { tokenAddress };

        const res = await fetch(API, {
          method: 'POST',
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
        const data = json?.data;
        if (json.errors) {
          setError('Unable to fetch overview data');
          return;
        }

        if (data) {
          setData(data);
        }
      } catch (e) {
        setError('Unable to fetch overview data');
      } finally {
        setLoading(false);
      }
    },
    []
  );
  return { fetch: fetchTokenOverview, data, loading, error };
}
