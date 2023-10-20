import { useEffect, useState } from 'react';
import { useGetCommonPoapsHolder } from './useGetCommonPoapsHolder';
import { useGetSocialFollowings } from './useGetSocialFollowings';
import { useGetNFTs } from './useGetNFTs';
import { useTokenTransfer } from './tokenTransfer';
import { useOnChainGraphData } from './useOnChainGraphData';
import { RecommendedUser } from '../types';

export function useGetOnChainData(
  address: string
): [RecommendedUser[], boolean] {
  const { data } = useOnChainGraphData();

  const [loading, setLoading] = useState(false);
  const [fetchPoapsData] = useGetCommonPoapsHolder(address);
  const [fetchFarcasterData] = useGetSocialFollowings(address, 'farcaster');
  const [fetchLensData] = useGetSocialFollowings(address, 'lens');
  const [fetchEthNft] = useGetNFTs(address, 'ethereum');
  const [fetchPolygonNft] = useGetNFTs(address, 'polygon');
  const [fetchTokenSent] = useTokenTransfer(address, 'sent');
  const [fetchTokenReceived] = useTokenTransfer(address, 'received');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchPoapsData();
      await fetchFarcasterData();
      // await fetchLensData();
      // await fetchEthNft();
      // await fetchPolygonNft();
      await fetchTokenSent();
      await fetchTokenReceived();
      setLoading(false);
    };
    fetchData();
  }, [
    fetchEthNft,
    fetchFarcasterData,
    fetchLensData,
    fetchPoapsData,
    fetchPolygonNft,
    fetchTokenReceived,
    fetchTokenSent
  ]);
  return [data, loading];
}
