import { useCallback, useState } from 'react';
import { apiKey } from '../constants';
import { OverviewQuery } from '../queries/tokensQuery';

// const API = 'https://api.beta.airstack.xyz/gql';
// temp remove below api later
const API = 'https://api.uat.airstack.xyz/gql';

export function useGetTokenOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const fetchTokenOverview = useCallback(
    async (variables: {
      polygonTokens: string[];
      eventIds: string[];
      ethereumTokens: string[];
    }) => {
      setLoading(true);
      let { polygonTokens, eventIds, ethereumTokens } = variables;
      polygonTokens = polygonTokens.length === 0 ? [''] : polygonTokens;
      eventIds = eventIds.length === 0 ? [''] : eventIds;
      ethereumTokens = ethereumTokens.length === 0 ? [''] : ethereumTokens;

      try {
        const query = OverviewQuery;

        const res = await fetch(API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: apiKey
          },
          body: JSON.stringify({
            query,
            variables: {
              polygonTokens,
              eventIds,
              ethereumTokens
            }
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
