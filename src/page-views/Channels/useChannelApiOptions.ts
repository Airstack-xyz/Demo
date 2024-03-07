import { useCallback } from 'react';
import { useSearchInput } from '../../hooks/useSearchInput';
import {
  farcasterChannelQuery,
  farcasterParticipentsQuery
} from '../../queries/channels';
import { createAppUrlWithQuery } from '../../utils/createAppUrlWithQuery';
import { OrderBy } from '../../../__generated__/airstack-types';

export function useChannelApiOptions() {
  const [inputs] = useSearchInput();
  const channelId = inputs.address[0] || '';
  const orderBy = inputs.sortOrder === 'ASC' ? OrderBy.Asc : OrderBy.Desc;
  return useCallback(() => {
    return [
      {
        label: 'Farcaster Channel Details',
        link: createAppUrlWithQuery(farcasterChannelQuery, {
          channelId
        })
      },
      {
        label: 'Farcaster Channel Participants',
        link: createAppUrlWithQuery(farcasterParticipentsQuery, {
          channelId,
          orderBy,
          limit: 20
        })
      }
    ];
  }, [channelId, orderBy]);
}
