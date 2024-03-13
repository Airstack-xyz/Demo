import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import {
  FcChannelParticipantsQuery,
  FcChannelParticipantsQueryVariables
} from '../../__generated__/airstack-types';
import { farcasterParticipentsQuery } from '@/queries/channels/participents';
import { useEffect, useState } from 'react';

export type Participents = NonNullable<
  FcChannelParticipantsQuery['FarcasterChannelParticipants']
>['FarcasterChannelParticipant'];

export type Participent = NonNullable<Participents>[0];
export function useGetChannels({
  identity,
  limit
}: {
  identity: string;
  limit: number;
}) {
  const [participants, setParticipants] = useState<Participents>(null);

  const [fetch, { data, loading: loadingQuery, ...rest }] =
    useLazyQueryWithPagination<
      FcChannelParticipantsQuery,
      FcChannelParticipantsQueryVariables
    >(farcasterParticipentsQuery, undefined, {
      onCompleted: data => {
        const participants =
          data?.FarcasterChannelParticipants?.FarcasterChannelParticipant || [];
        setParticipants(existingParticipants => [
          ...(existingParticipants || []),
          ...participants
        ]);
      }
    });

  useEffect(() => {
    if (identity) {
      fetch({
        identity,
        limit
      });
      setParticipants(null);
    }
  }, [fetch, identity, limit]);

  const loading = loadingQuery || !data;

  return {
    loading,
    participants,
    ...rest
  } as const;
}
