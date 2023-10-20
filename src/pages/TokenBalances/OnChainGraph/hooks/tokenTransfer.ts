import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import {
  tokenReceivedQuery,
  tokenSentQuery
} from '../../../../queries/onChainGraph/tokenTransfer';
import { TokenQueryResponse, Transfer } from '../types/tokenSentReceived';
import { useCallback, useEffect, useRef } from 'react';
import { useOnChainGraphData } from './useOnChainGraphData';
import { RecommendedUser } from '../types';
import { MAX_ITEMS } from '../constants';

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
  const { setData } = useOnChainGraphData();
  const totalItemsFetchedRef = useRef(0);
  const loadingRef = useRef(false);
  const [fetch, { data, loading, error, pagination }] =
    useLazyQueryWithPagination<Transfer[]>(
      transferType === 'sent' ? tokenSentQuery : tokenReceivedQuery,
      { user: address },
      {
        dataFormatter(data: TokenQueryResponse) {
          const ethData = (data?.Ethereum?.TokenTransfer ?? []).map(
            transfer => transfer.account
          );

          const polygonData = (data?.Polygon?.TokenTransfer ?? []).map(
            transfer => transfer.account
          );

          totalItemsFetchedRef.current += ethData.length + polygonData.length;

          return [...ethData, ...polygonData] as Transfer[];
        },
        onCompleted(data) {
          setData(recommendedUsers =>
            formatData(data, recommendedUsers, transferType === 'sent')
          );
        }
      }
    );

  const limitReached = totalItemsFetchedRef.current >= MAX_ITEMS;

  useEffect(() => {
    if (limitReached) {
      console.log('limit reached for token transfers');
      return;
    }
    if (pagination.hasNextPage && !loading) {
      pagination.getNextPage();
    }

    if (!pagination.hasNextPage) {
      loadingRef.current = false;
    }
  }, [limitReached, loading, pagination]);

  const fetchTokenSent = useCallback(() => {
    if (loadingRef.current) {
      return;
    }
    loadingRef.current = true;
    fetch();
  }, [fetch]);

  return [fetchTokenSent, data, loading || loadingRef.current, error];
}
