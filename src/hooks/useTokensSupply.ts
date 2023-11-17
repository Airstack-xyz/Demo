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
    (totalSupply: any): number => {
      let supply = 0;
      if (totalSupply?.PoapEvents) {
        const event = (totalSupply as TotalPoapsSupply)?.PoapEvents?.PoapEvent;
        if (!event) return 0;

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
      if (_totalSupply?.base?.totalSupply) {
        supply += parseInt(_totalSupply.base.totalSupply);
      }

      return supply;
    },
    []
  );

  const fetch = useCallback(
    async (tokenAddress: string[]) => {
      setLoading(true);
      setData(null);
      const promises: FetchQueryReturnType<unknown>[] = [];
      tokenAddress.forEach(token => {
        const isPoap = !token.startsWith('0x');
        const variables = isPoap ? { eventId: token } : { tokenAddress: token };
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
          const _supply: number = getTokenFromResponse(data);
          if (_supply) {
            supply[tokenAddress[index].toLowerCase()] = _supply;
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
