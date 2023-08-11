import { useCallback, useState } from 'react';
import { TotalPoapsSupply, TotalSupply } from '../pages/TokenHolders/types';
import { fetchQuery } from '@airstack/airstack-react';
import { TokenTotalSupplyQuery } from '../queries';
import { FetchQueryReturnType } from '@airstack/airstack-react/types';
import { POAPSupplyQuery } from '../queries/overviewDetailsTokens';

type Result = Record<string, number>;

export function useTokensSupply() {
  const [data, setData] = useState<Result | null>({});
  const [loading, setLoading] = useState(false);

  const getTokenFromResponse = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (totalSupply: any, isPoap = false) => {
      let supply = 0;
      if (isPoap) {
        const event = (totalSupply as TotalPoapsSupply)?.PoapEvents?.PoapEvent;
        if (!event) return;

        supply = (event || []).reduce(
          (acc, event) => acc + event?.tokenMints,
          0
        );
        return supply;
      }

      const _totalSupply = totalSupply as TotalSupply;
      supply = 0;

      if (_totalSupply?.ethereum?.totalSupply) {
        supply += parseInt(_totalSupply.ethereum.totalSupply);
      }

      if (_totalSupply?.polygon?.totalSupply) {
        supply += parseInt(_totalSupply.polygon.totalSupply);
      }
      return supply;
    },
    []
  );

  const fetch = useCallback(
    async (tokenAddress: string[], isPoap = false) => {
      setLoading(true);
      setData(null);
      const promises: FetchQueryReturnType[] = [];
      tokenAddress.forEach(tokenAddress => {
        const variables = isPoap ? { eventId: tokenAddress } : { tokenAddress };
        const request = fetchQuery(
          isPoap ? POAPSupplyQuery : TokenTotalSupplyQuery,
          variables
        );
        promises.push(request);
      });
      const results = await Promise.allSettled(promises);
      const supply: Result = {};
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result?.value?.data) {
          const { data } = result.value;
          const token = getTokenFromResponse(data, isPoap);
          if (token) {
            supply[tokenAddress[index].toLowerCase()] = token;
          }
        }
      });
      setData(supply);
      setLoading(false);
    },
    [getTokenFromResponse]
  );
  return [fetch, data, loading] as const;
}
