import { fetchQuery } from '@airstack/airstack-react';
import { FetchQueryReturnType } from '@airstack/airstack-react/types';
import { useCallback, useState } from 'react';
import { tokenBlockchains } from '../constants';
import { TokenBalance } from '../pages/TokenBalances/types';
import { PoapsData, TokensData } from '../pages/TokenHolders/types';
import { PoapOwnerQuery, TokenOwnerQuery } from '../queries';
import { useOverviewTokens } from '../store/tokenHoldersOverview';

type OverviewTokenOwnerResponse = PoapsData & TokensData;

type OverviewToken = {
  name: string;
  tokenId: string;
  tokenAddress: string;
  image: string;
  tokenType: string;
  blockchain: string;
  eventId?: string;
};

export function useGetTokens() {
  const [, setTokens] = useOverviewTokens(['tokens']);

  const [data, setData] = useState<OverviewToken[] | null>(null);
  const [loading, setLoading] = useState(false);

  const getTokenFromResponse = useCallback(
    (tokensData: OverviewTokenOwnerResponse) => {
      if (tokensData?.Poaps) {
        const poaps = tokensData?.Poaps?.Poap || [];

        const poap = poaps[0];

        if (!poap) return null;

        return {
          name: poap?.poapEvent?.eventName || '',
          tokenId: poap?.tokenId || '',
          tokenAddress: poap?.tokenAddress || '',
          image: poap?.poapEvent?.logo?.image?.small || '',
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
          tokenBalance?.token?.logo?.small ||
          tokenBalance?.tokenNfts?.contentValue?.image?.small ||
          tokenBalance?.token?.projectDetails?.imageUrl ||
          '',
        tokenType: tokenBalance?.tokenType,
        blockchain: tokenBalance?.blockchain
      };
    },
    []
  );

  const fetchTokens = useCallback(
    async (tokenAddresses: string[]) => {
      setLoading(true);
      setData([]);
      setTokens({ tokens: [] });

      const promises: FetchQueryReturnType<OverviewTokenOwnerResponse>[] = [];

      tokenAddresses.forEach(address => {
        const isPoap = !address.startsWith('0x');
        if (isPoap) {
          const request = fetchQuery(PoapOwnerQuery, {
            eventId: address,
            limit: 1
          });
          promises.push(request);
        } else {
          const request = fetchQuery(TokenOwnerQuery, {
            tokenAddress: address,
            limit: 1
          });
          promises.push(request);
        }
      });

      const results = await Promise.allSettled(promises);
      const tokens: OverviewToken[] = [];

      results.forEach(result => {
        if (result.status === 'fulfilled' && result?.value?.data) {
          const data = result.value.data as OverviewTokenOwnerResponse;
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

  return [fetchTokens, data, loading] as const;
}
