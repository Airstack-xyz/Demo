import { useCallback, useState } from 'react';
import { Poap } from '../pages/TokenHolders/types';
import { fetchQuery } from '@airstack/airstack-react';
import { PoapOwnerQuery, TokenOwnerQuery } from '../queries';
import { FetchQueryReturnType } from '@airstack/airstack-react/types';
import { TokenBalance } from '../pages/TokenBalances/types';
import { useOverviewTokens } from '../store/tokenHoldersOverview';
import { tokenBlockchains } from '../constants';

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

      let tokenBalance: TokenBalance | null = null;

      for (let i = 0; i < tokenBlockchains.length; i++) {
        const blockchain = tokenBlockchains[i];
        if (tokensData?.[blockchain]?.TokenBalance?.length > 0) {
          tokenBalance = tokensData[blockchain].TokenBalance[0];
          break;
        }
      }

      if (!tokenBalance) return null;

      return {
        name: tokenBalance?.token?.name || '',
        tokenId: tokenBalance?.tokenId || '',
        tokenAddress: tokenBalance?.tokenAddress || '',
        image:
          tokenBalance?.token?.logo?.medium ||
          tokenBalance?.tokenNfts?.contentValue?.image?.medium ||
          tokenBalance?.token?.projectDetails?.imageUrl ||
          '',
        tokenType: tokenBalance?.tokenType,
        blockchain: tokenBalance?.blockchain
      };
    },
    []
  );

  const fetch = useCallback(
    async (tokenAddress: string[]) => {
      setLoading(true);
      setData([]);
      setTokens({ tokens: [] });

      const promises: FetchQueryReturnType<unknown>[] = [];
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
