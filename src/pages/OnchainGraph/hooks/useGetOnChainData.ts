import { useCallback, useEffect, useRef, useState } from 'react';
import { useGetCommonPoapsHolder } from './useGetCommonPoapsHolder';
import { useGetSocialFollowings } from './useGetSocialFollowings';
import { useGetNFTs } from './useGetNFTs';
import { useTokenTransfer } from './useTokenTransfer';
import { useGetSocialFollowers } from './useGetSocialFollowers';

export function useGetOnChainData(address: string) {
  const loadingRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [fetchPoapsData, cancelPoapRequests] = useGetCommonPoapsHolder(address);

  const [fetchFarcasterFollowings, cancelFarcasterFollowingRequest] =
    useGetSocialFollowings(address, 'farcaster');
  const [fetchLensFollowings, cancelLensFollowingsRequest] =
    useGetSocialFollowings(address, 'lens');

  const [fetchFarcasterFollowers, cancelFarcasterFollowersRequest] =
    useGetSocialFollowers(address, 'farcaster');
  const [fetchLensFollowers, cancelLensFollowersRequest] =
    useGetSocialFollowers(address, 'lens');

  const [fetchEthNft, cancelEthRequest] = useGetNFTs(address, 'ethereum');
  const [fetchPolygonNft, cancelPolygonRequest] = useGetNFTs(
    address,
    'polygon'
  );
  // TODO: Uncomment when base blockchain is deployed
  // const [fetchBaseNft, cancelBaseRequest] = useGetNFTs(address, 'base');

  const [fetchTokenSent, cancelSentRequest] = useTokenTransfer(address, 'sent');
  const [fetchTokenReceived, cancelReceivedRequest] = useTokenTransfer(
    address,
    'received'
  );

  const fetchData = useCallback(async () => {
    if (loadingRef.current || !address) return;
    loadingRef.current = true;
    window.onchainGraphRequestCanceled = false;
    setLoading(true);
    await fetchPoapsData();
    await fetchFarcasterFollowings();
    await fetchLensFollowings();
    await fetchFarcasterFollowers();
    await fetchLensFollowers();
    await fetchEthNft();
    await fetchPolygonNft();
    // TODO: Uncomment when base blockchain is deployed
    // await fetchBaseNft();
    await fetchTokenSent();
    await fetchTokenReceived();
    setLoading(false);
    loadingRef.current = false;
  }, [
    address,
    fetchEthNft,
    fetchFarcasterFollowers,
    fetchFarcasterFollowings,
    fetchLensFollowers,
    fetchLensFollowings,
    fetchPoapsData,
    fetchPolygonNft,
    fetchTokenReceived,
    fetchTokenSent
  ]);

  const cancelRequests = useCallback(() => {
    window.onchainGraphRequestCanceled = true;
    cancelPoapRequests();
    cancelFarcasterFollowingRequest();
    cancelLensFollowingsRequest();
    cancelFarcasterFollowersRequest();
    cancelLensFollowersRequest();
    cancelEthRequest();
    cancelPolygonRequest();
    // TODO: Uncomment when base blockchain is deployed
    // cancelBaseRequest();
    cancelSentRequest();
    cancelReceivedRequest();
    setLoading(false);
    loadingRef.current = false;
  }, [
    cancelEthRequest,
    cancelFarcasterFollowersRequest,
    cancelFarcasterFollowingRequest,
    cancelLensFollowersRequest,
    cancelLensFollowingsRequest,
    cancelPoapRequests,
    cancelPolygonRequest,
    cancelReceivedRequest,
    cancelSentRequest
  ]);

  useEffect(() => {
    window.onchainGraphRequestCanceled = false;
    return () => {
      cancelRequests();
    };
  }, [cancelRequests]);

  return [fetchData, loading, cancelRequests] as const;
}
