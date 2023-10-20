import { fetchQueryWithPagination } from '@airstack/airstack-react';
import {
  nftAddressesQuery,
  nftQuery
} from '../../../../queries/onChainGraph/nft';
import { useCallback, useRef, useState } from 'react';
import { NFTQueryResponse, TokenBalance } from '../types/nft';
import { FetchPaginatedQueryReturnType } from '@airstack/airstack-react/types';
import { MAX_ITEMS, QUERY_LIMIT, nftsToIgnore } from '../constants';
import { RecommendedUser } from '../types';
import { useOnChainGraphData } from './useOnChainGraphData';
import { paginateRequest } from '../utils';

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
): [() => Promise<void>, boolean] {
  const { setData, setTotalScannedDocuments } = useOnChainGraphData();
  const totalItemsCount = useRef(0);
  const [loading, setLoading] = useState(false);

  const handleRequests = useCallback(
    async (requests: FetchPaginatedQueryReturnType<NFTQueryResponse>[]) => {
      await Promise.all(requests).then(responses => {
        const data = responses.reduce((acc: TokenBalance[], response) => {
          return [
            ...acc,
            ...(response?.data?.TokenBalances?.TokenBalance || [])
          ];
        }, []);
        totalItemsCount.current += data.length;
        setData(recommendedUsers =>
          formatData(data, recommendedUsers, blockchain)
        );
        if (totalItemsCount.current >= MAX_ITEMS) {
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
          setTotalScannedDocuments(
            count => count + newRequests.length * QUERY_LIMIT
          );
          return handleRequests(newRequests);
        } else {
          setLoading(false);
        }
      });
    },
    [blockchain, setData, setTotalScannedDocuments]
  );

  const fetchNFT = useCallback(
    (addresses: string[]) => {
      setLoading(true);
      setTotalScannedDocuments(count => count + addresses.length * QUERY_LIMIT);
      const requests = [];
      // remove addresses that we don't want to fetch nfts for
      addresses = addresses.filter(address => !nftsToIgnore.includes(address));
      for (let i = 0; i < addresses.length; i += maxAddressPerQuery) {
        const chunk = addresses.slice(i, i + maxAddressPerQuery);
        requests.push(
          fetchQueryWithPagination<NFTQueryResponse>(
            nftQuery,
            {
              addresses: chunk,
              blockchain,
              limit: 200
            },
            {
              cache: false
            }
          )
        );
      }
      return handleRequests(requests);
    },
    [blockchain, handleRequests, setTotalScannedDocuments]
  );

  const fetchData = useCallback(async () => {
    const request = fetchQueryWithPagination<NFTQueryResponse>(
      nftAddressesQuery,
      {
        user: address,
        blockchain
      },
      {
        cache: false
      }
    );
    setTotalScannedDocuments(count => count + QUERY_LIMIT);
    await paginateRequest(request, async data => {
      const tokenAddresses = data?.TokenBalances.TokenBalance.map(
        token => token.tokenAddress
      );
      await fetchNFT(tokenAddresses as string[]);
      const shouldFetchMore = totalItemsCount.current < MAX_ITEMS;
      if (shouldFetchMore) {
        setTotalScannedDocuments(count => count + QUERY_LIMIT);
      }
      return shouldFetchMore;
    });
  }, [address, blockchain, fetchNFT, setTotalScannedDocuments]);

  return [fetchData, loading];
}
