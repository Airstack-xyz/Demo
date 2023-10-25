import { useCallback, useState } from 'react';
import { Token, Poap } from '../pages/TokenHolders/types';
import { fetchQuery } from '@airstack/airstack-react';
import { PoapOwnerQuery, TokenOwnerQuery } from '../queries';
import { FetchQueryReturnType } from '@airstack/airstack-react/types';
import { TokenBalance } from '../pages/TokenBalances/types';
import { useOverviewTokens } from '../store/tokenHoldersOverview';

export type OverviewTokenDetailsType = {
  name: string;
  tokenId: string;
  tokenAddress: string;
  image: string;
  tokenType: string;
  blockchain: string;
  eventId?: string;
};

export function useFetchTokens() {
  const setTokens = useOverviewTokens(['tokens'])[1];

  const [data, setData] = useState<null | OverviewTokenDetailsType[]>(null);
  const [loading, setLoading] = useState(false);

  const getTokenFromResponse = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (tokensData: any) => {
      if (tokensData?.Poaps) {
        const poaps: Poap[] = tokensData?.Poaps?.Poap || [];
        const poap = poaps[0] as Poap;
        if (!poap) return null;

        return {
          name: poap?.poapEvent?.eventName || '',
          tokenId: poap?.tokenId || '',
          tokenAddress: poap?.tokenAddress || '',
          image: poap?.poapEvent?.logo?.image?.medium || '',
          tokenType: 'POAP',
          blockchain: 'ethereum',
          eventId: poap?.eventId
        };
      }

      const ethTokenBalances: Token[] =
        tokensData?.ethereum?.TokenBalance || [];
      const polygonTokenBalances: Token[] =
        tokensData?.polygon?.TokenBalance || [];

      const token = (ethTokenBalances[0] ||
        polygonTokenBalances[0]) as TokenBalance;

      if (!token) return null;

      return {
        name: token?.token?.name || '',
        tokenId: token?.tokenId || '',
        tokenAddress: token?.tokenAddress || '',
        image:
          token?.token?.logo?.medium ||
          token?.tokenNfts?.contentValue?.image?.medium ||
          token?.token?.projectDetails?.imageUrl ||
          '',
        tokenType: token?.tokenType,
        blockchain: token?.blockchain
      };
    },
    []
  );

  const fetch = useCallback(
    async (tokenAddress: string[]) => {
      setLoading(true);
      setData([]);
      setTokens({ tokens: [] });

      const promises: FetchQueryReturnType[] = [];
      tokenAddress.forEach(tokenAddress => {
        const isPoap = !tokenAddress.startsWith('0x');
        const variables = isPoap ? { eventId: tokenAddress } : { tokenAddress };
        const request = fetchQuery(isPoap ? PoapOwnerQuery : TokenOwnerQuery, {
          ...variables,
          limit: 1
        });
        promises.push(request);
      });
      const results = await Promise.allSettled(promises);
      const tokens: OverviewTokenDetailsType[] = [];
      results.forEach(result => {
        if (result.status === 'fulfilled' && result?.value?.data) {
          const { data } = result.value;
          const token = getTokenFromResponse(data);
          if (token) {
            tokens.push(token);
          }
        }
      });
      setData(tokens);
      setLoading(false);
    },
    [getTokenFromResponse, setTokens]
  );

  return [fetch, data, loading] as const;
}
