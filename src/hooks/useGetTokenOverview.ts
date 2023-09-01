import { useCallback, useState } from 'react';
import { apiKey } from '../constants';
import { getOverviewQuery } from '../queries/tokensQuery';

// const API = 'https://api.beta.airstack.xyz/gql';
// temp remove below api later
const API = 'https://api.uat.airstack.xyz/gql';

type Variable = {
  polygonTokens: string[];
  eventIds: string[];
  ethereumTokens: string[];
};
export function useGetTokenOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const fetchTokenOverview = useCallback(async (tokenAddress: Variable) => {
    setLoading(true);

    const variables: Partial<Variable> = {};
    for (const key in tokenAddress) {
      const value = tokenAddress[key as keyof Variable];
      if (value && value.length > 0) {
        variables[key as keyof Variable] = value;
      }
    }

    try {
      const query = getOverviewQuery(
        !!variables.polygonTokens?.length,
        !!variables.eventIds?.length,
        !!variables.ethereumTokens?.length
      );

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
  }, []);
  return { fetch: fetchTokenOverview, data, loading, error };
}
