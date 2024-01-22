import { fetchQuery } from '@airstack/airstack-react';
import { FetchQueryReturnType } from '@airstack/airstack-react/types';
import { useCallback, useState } from 'react';
import { tokenBlockchains } from '../constants';
import {
  TotalPoapsSupply,
  TotalTokensSupply
} from '../pages/TokenHolders/types';
import { POAPSupplyQuery, TokenSupplyQuery } from '../queries/supplyQuery';

type TokensSupplyResponse = TotalTokensSupply & TotalPoapsSupply;

type TokensSupplyData = Record<string, number>;

export function useGetTokensSupply() {
  const [data, setData] = useState<TokensSupplyData | null>({});
  const [loading, setLoading] = useState(false);

  const getCountFromResponse = useCallback(
    (tokensData: TokensSupplyResponse): number => {
      let supplyCount = 0;

      if (tokensData?.PoapEvents) {
        const poapEvent = tokensData?.PoapEvents?.PoapEvent;

        if (!poapEvent) return 0;

        supplyCount = (poapEvent || []).reduce(
          (prev, item) => prev + item?.tokenMints,
          0
        );

        return supplyCount;
      }

      tokenBlockchains.forEach(blockchain => {
        if (tokensData?.[blockchain]?.totalSupply) {
          supplyCount += parseInt(tokensData?.[blockchain]?.totalSupply);
        }
      });

      return supplyCount;
    },
    []
  );

  const fetchTokensSupply = useCallback(
    async (tokenAddresses: string[]) => {
      setLoading(true);
      setData(null);

      const promises: FetchQueryReturnType<TokensSupplyResponse>[] = [];

      tokenAddresses.forEach(address => {
        const isPoap = !address.startsWith('0x');
        if (isPoap) {
          const request = fetchQuery<TokensSupplyResponse>(POAPSupplyQuery, {
            eventId: address
          });
          promises.push(request);
        } else {
          const request = fetchQuery<TokensSupplyResponse>(TokenSupplyQuery, {
            tokenAddress: address
          });
          promises.push(request);
        }
      });

      const results = await Promise.allSettled(promises);
      const supplyData: TokensSupplyData = {};

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result?.value?.data) {
          const data = result.value.data as TokensSupplyResponse;
          const count: number = getCountFromResponse(data);
          if (count) {
            supplyData[tokenAddresses[index].toLowerCase()] = count;
          }
        }
      });

      setData(supplyData);
      setLoading(false);
    },
    [getCountFromResponse]
  );

  return [fetchTokensSupply, data, loading] as const;
}
