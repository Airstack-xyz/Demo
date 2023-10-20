import {
  fetchQueryWithPagination,
  useLazyQueryWithPagination
} from '@airstack/airstack-react';
import {
  nftAddressesQuery,
  nftQuery
} from '../../../../queries/onChainGraph/nft';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NFTQueryResponse, TokenBalance } from '../types/nft';
import { FetchPaginatedQueryReturnType } from '@airstack/airstack-react/types';
import { MAX_ITEMS } from '../constants';
import { RecommendedUser } from '../types';
import { useOnChainGraphData } from './useOnChainGraphData';

const maxAddressPerQuery = 100;

function formatData(
  data: TokenBalance[],
  _recommendedUsers: RecommendedUser[] = [],
  blockchain: 'ethereum' | 'polygon'
) {
  const recommendedUsers: RecommendedUser[] = [..._recommendedUsers];

  for (const nft of data) {
    const { owner, token } = nft ?? {};
    const { name, logo, address, tokenNfts } = token ?? {};
    const { addresses } = owner ?? {};
    // TODO confirm if we want to keep the condition below
    if (
      name?.length > 0 &&
      !name?.includes('-Follower') &&
      !name?.includes('$') &&
      !name?.includes('Lens Protocol Profiles') &&
      !name?.includes('-Collect')
    ) {
      const existingUserIndex = recommendedUsers.findIndex(
        ({ addresses: recommendedUsersAddresses }) =>
          recommendedUsersAddresses?.some?.(address =>
            addresses?.includes?.(address)
          )
      );
      if (existingUserIndex !== -1) {
        const _addresses =
          recommendedUsers?.[existingUserIndex]?.addresses || [];
        recommendedUsers[existingUserIndex].addresses = [
          ..._addresses,
          ...addresses
        ]?.filter((address, index, array) => array.indexOf(address) === index);
        const _nfts = recommendedUsers?.[existingUserIndex]?.nfts || [];
        const nftExists = _nfts.some(nft => nft.address === address);
        if (!nftExists) {
          _nfts?.push({
            name,
            image: logo?.small,
            blockchain,
            address,
            tokenNfts: tokenNfts[0]
          });
        }
        recommendedUsers[existingUserIndex].nfts = [..._nfts];
      } else {
        recommendedUsers.push({
          ...owner,
          nfts: [
            {
              name,
              image: logo?.small,
              blockchain,
              address,
              tokenNfts: tokenNfts[0]
            }
          ]
        });
      }
    }
  }
  return recommendedUsers;
}

export function useGetNFTs(
  address: string,
  blockchain: 'ethereum' | 'polygon' = 'ethereum'
) {
  const { setData } = useOnChainGraphData();
  const totalItemsFetchedRef = useRef(0);
  const [loading, setLoading] = useState(false);

  const [
    fetchNFTAddress,
    {
      data: nftData,
      loading: loadingNFT,
      error: nftError,
      pagination: nftPagination
    }
  ] = useLazyQueryWithPagination(
    nftAddressesQuery,
    { user: address, blockchain },
    {
      dataFormatter(data: NFTQueryResponse) {
        const tokenAddresses = data.TokenBalances.TokenBalance.map(
          token => token.tokenAddress
        );
        return tokenAddresses as string[];
      }
    }
  );

  const handleRequests = useCallback(
    (requests: FetchPaginatedQueryReturnType<NFTQueryResponse>[]) => {
      Promise.all(requests).then(responses => {
        const data = responses.reduce((acc: TokenBalance[], response) => {
          return [
            ...acc,
            ...(response?.data?.TokenBalances?.TokenBalance || [])
          ];
        }, []);
        totalItemsFetchedRef.current += data.length;
        setData(recommendedUsers =>
          formatData(data, recommendedUsers, blockchain)
        );
        if (totalItemsFetchedRef.current >= MAX_ITEMS) {
          console.log(' reached limit for nft ', blockchain);
          setLoading(false);
          return;
        }
        const newRequests: FetchPaginatedQueryReturnType<NFTQueryResponse>[] =
          [];
        responses.forEach(response => {
          if (response?.hasNextPage) {
            // eslint-disable-next-line
            // @ts-ignore
            newRequests.push(response?.getNextPage());
          }
        });
        if (newRequests.length) {
          handleRequests(newRequests);
        } else {
          setLoading(false);
        }
      });
    },
    [blockchain, setData]
  );

  const fetchNFT = useCallback(
    (addresses: string[]) => {
      setLoading(true);
      const requests = [];
      // remove ENS address
      addresses = addresses.filter(
        address => address !== '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'
      );
      for (let i = 0; i < addresses.length; i += maxAddressPerQuery) {
        const chunk = addresses.slice(i, i + maxAddressPerQuery);
        requests.push(
          fetchQueryWithPagination<NFTQueryResponse>(nftQuery, {
            addresses: chunk,
            blockchain,
            limit: 200
          })
        );
      }
      handleRequests(requests);
    },
    [blockchain, handleRequests]
  );

  useEffect(() => {
    if (nftData) {
      fetchNFT(nftData);
    }
  }, [fetchNFT, nftData]);

  useEffect(() => {
    if (nftPagination.hasNextPage && !loadingNFT) {
      nftPagination.getNextPage();
    }
  }, [loadingNFT, nftPagination]);

  return [fetchNFTAddress, loading || loadingNFT, nftError];
}
