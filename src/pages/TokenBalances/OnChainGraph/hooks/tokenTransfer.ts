import { fetchQueryWithPagination } from '@airstack/airstack-react';
import {
  tokenReceivedQuery,
  tokenSentQuery
} from '../../../../queries/onChainGraph/tokenTransfer';
import { TokenQueryResponse, Transfer } from '../types/tokenSentReceived';
import { useCallback, useRef } from 'react';
import { useOnChainGraphData } from './useOnChainGraphData';
import { RecommendedUser } from '../types';
import { MAX_ITEMS, QUERY_LIMIT } from '../constants';

export function formatData(
  data: Transfer[],
  _recommendedUsers: RecommendedUser[] = [],
  isSent: boolean
) {
  const recommendedUsers: RecommendedUser[] = [..._recommendedUsers];

  for (const transfer of data) {
    const { addresses = [] } = transfer || {};
    const existingUserIndex = recommendedUsers.findIndex(
      ({ addresses: recommendedUsersAddresses }) =>
        recommendedUsersAddresses?.some?.(address =>
          addresses?.includes?.(address)
        )
    );
    const _tokenTransfers: {
      sent?: boolean;
      received?: boolean;
    } = {};
    if (isSent) {
      _tokenTransfers['sent'] = true;
    } else {
      _tokenTransfers['received'] = true;
    }
    if (existingUserIndex !== -1) {
      const _addresses = recommendedUsers?.[existingUserIndex]?.addresses || [];
      recommendedUsers[existingUserIndex].addresses = [
        ..._addresses,
        ...addresses
      ]?.filter((address, index, array) => array.indexOf(address) === index);
      recommendedUsers[existingUserIndex].tokenTransfers = {
        ...(recommendedUsers?.[existingUserIndex]?.tokenTransfers ?? {}),
        ..._tokenTransfers
      };
    } else {
      recommendedUsers.push({
        ...transfer,
        tokenTransfers: {
          ..._tokenTransfers
        }
      });
    }
  }

  return recommendedUsers;
}

export function useTokenTransfer(
  address: string,
  transferType: 'sent' | 'received' = 'sent'
) {
  const { setData, setTotalScannedDocuments } = useOnChainGraphData();
  const totalItemsFetchedRef = useRef(0);

  const fetchData = useCallback(async () => {
    const pagination = {
      hasNextPage: false,
      getNextPage: () => {
        // empty function
      }
    };
    do {
      setTotalScannedDocuments(count => count + QUERY_LIMIT);
      const { data, hasNextPage, getNextPage } =
        await fetchQueryWithPagination<TokenQueryResponse>(
          transferType === 'sent' ? tokenSentQuery : tokenReceivedQuery,
          {
            user: address
          }
        );

      pagination.hasNextPage = hasNextPage;
      pagination.getNextPage = getNextPage;
      if (!data) break;
      const ethData = (data?.Ethereum?.TokenTransfer ?? []).map(
        transfer => transfer.account
      );

      const polygonData = (data?.Polygon?.TokenTransfer ?? []).map(
        transfer => transfer.account
      );

      const tokenTransfer = [...ethData, ...polygonData] as Transfer[];

      totalItemsFetchedRef.current += tokenTransfer.length;
      setData(recommendedUsers =>
        formatData(tokenTransfer, recommendedUsers, transferType === 'sent')
      );
    } while (
      pagination.hasNextPage &&
      totalItemsFetchedRef.current >= MAX_ITEMS
    );
  }, [address, setData, setTotalScannedDocuments, transferType]);

  return [fetchData] as const;
}
