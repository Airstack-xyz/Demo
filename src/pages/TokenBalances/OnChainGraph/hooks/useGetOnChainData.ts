import { useCallback, useEffect, useRef, useState } from 'react';
import { useGetCommonPoapsHolder } from './useGetCommonPoapsHolder';
import { useGetSocialFollowings } from './useGetSocialFollowings';
import { useGetNFTs } from './useGetNFTs';
import { useTokenTransfer } from './useTokenTransfer';

export function useGetOnChainData(address: string) {
  const loadingRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [fetchPoapsData, cancelPoapRequests] = useGetCommonPoapsHolder(address);
  const [fetchFarcasterData, cancelFarcasterRequest] = useGetSocialFollowings(
    address,
    'farcaster'
  );
  const [fetchLensData, cancelLensRequest] = useGetSocialFollowings(
    address,
    'lens'
  );
  const [fetchEthNft, cancelEthRequest] = useGetNFTs(address, 'ethereum');
  const [fetchPolygonNft, cancelPolygonRequest] = useGetNFTs(
    address,
    'polygon'
  );
  const [fetchTokenSent, cancelSentRequest] = useTokenTransfer(address, 'sent');
  const [fetchTokenReceived, cancelReceivedRequest] = useTokenTransfer(
    address,
    'received'
  );

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

  const cancelRequests = useCallback(() => {
    cancelPoapRequests();
    cancelFarcasterRequest();
    cancelLensRequest();
    cancelEthRequest();
    cancelPolygonRequest();
    cancelSentRequest();
    cancelReceivedRequest();
    setLoading(false);
    loadingRef.current = false;
  }, [
    cancelEthRequest,
    cancelFarcasterRequest,
    cancelLensRequest,
    cancelPoapRequests,
    cancelPolygonRequest,
    cancelReceivedRequest,
    cancelSentRequest
  ]);

  return [loading, cancelRequests] as const;
}
