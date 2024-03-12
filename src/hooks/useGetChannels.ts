import { useQuery } from '@airstack/airstack-react';
import {
  FcChannelParticipantsQuery,
  FcChannelParticipantsQueryVariables
} from '../../__generated__/airstack-types';
import { farcasterParticipentsQuery } from '@/queries/channels/participents';

export function useGetChannels({
  identity,
  limit
}: {
  identity: string;
  limit: number;
}) {
  const { data, loading: loadingQuery } = useQuery<
    FcChannelParticipantsQuery,
    FcChannelParticipantsQueryVariables
  >(farcasterParticipentsQuery, {
    identity,
    limit
  });

  const loading = loadingQuery || !data;
  const participants =
    data?.FarcasterChannelParticipants?.FarcasterChannelParticipant;

  return {
    loading,
    participants
  } as const;
}
