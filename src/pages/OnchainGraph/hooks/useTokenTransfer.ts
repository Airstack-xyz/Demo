import { fetchQueryWithPagination } from '@airstack/airstack-react';
import {
  tokenReceivedQuery,
  tokenSentQuery
} from '../../../queries/onChainGraph/tokenTransfer';
import { TokenQueryResponse, Transfer } from '../types/tokenSentReceived';
import { useCallback, useRef } from 'react';
import { useOnchainGraphContext } from './useOnchainGraphContext';
import { RecommendedUser } from '../types';
import { MAX_ITEMS, QUERY_LIMIT } from '../constants';
import { paginateRequest } from '../utils';

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
  const requestCanceled = useRef(false);
  const { setData, setTotalScannedDocuments } = useOnchainGraphContext();
  const totalItemsCount = useRef(0);

  const fetchData = useCallback(async () => {
    if (requestCanceled.current) {
      return false;
    }
    const request = fetchQueryWithPagination<TokenQueryResponse>(
      transferType === 'sent' ? tokenSentQuery : tokenReceivedQuery,
      {
        user: address
      },
      {
        cache: false
      }
    );
    setTotalScannedDocuments(count => count + QUERY_LIMIT);
    await paginateRequest(request, async data => {
      if (requestCanceled.current) {
        return false;
      }
      const ethData = (data?.Ethereum?.TokenTransfer ?? []).map(
        transfer => transfer.account
      );
      const polygonData = (data?.Polygon?.TokenTransfer ?? []).map(
        transfer => transfer.account
      );

      const tokenTransfer = [...ethData, ...polygonData] as Transfer[];
      totalItemsCount.current += tokenTransfer.length;
      setData(recommendedUsers =>
        formatData(tokenTransfer, recommendedUsers, transferType === 'sent')
      );

      const shouldFetchMore = totalItemsCount.current < MAX_ITEMS;
      if (shouldFetchMore) {
        setTotalScannedDocuments(count => count + QUERY_LIMIT);
      }
      return shouldFetchMore;
    });
  }, [address, setData, setTotalScannedDocuments, transferType]);

  const cancelRequest = useCallback(() => {
    requestCanceled.current = true;
  }, []);

  return [fetchData, cancelRequest] as const;
}
