import { useEffect, useRef, useState } from 'react';
import { useGetCommonPoapsHolder } from './useGetCommonPoapsHolder';
import { useGetSocialFollowings } from './useGetSocialFollowings';
import { useGetNFTs } from './useGetNFTs';
import { useTokenTransfer } from './useTokenTransfer';

export function useGetOnChainData(address: string): [boolean] {
  const loadingRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [fetchPoapsData] = useGetCommonPoapsHolder(address);
  const [fetchFarcasterData] = useGetSocialFollowings(address, 'farcaster');
  const [fetchLensData] = useGetSocialFollowings(address, 'lens');
  const [fetchEthNft] = useGetNFTs(address, 'ethereum');
  const [fetchPolygonNft] = useGetNFTs(address, 'polygon');
  const [fetchTokenSent] = useTokenTransfer(address, 'sent');
  const [fetchTokenReceived] = useTokenTransfer(address, 'received');

  useEffect(() => {
    if (loadingRef.current) return;
    const fetchData = async () => {
      loadingRef.current = true;
      setLoading(true);
      await fetchPoapsData();
      await fetchFarcasterData();
      await fetchLensData();
      await fetchEthNft();
      await fetchPolygonNft();
      await fetchTokenSent();
      await fetchTokenReceived();
      setLoading(false);
      loadingRef.current = false;
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
  return [loading];
}
