import { FarcasterChannelParticipantsQuery } from '../../../../__generated__/airstack-types';

export type ParticipentType = NonNullable<
  NonNullable<
    FarcasterChannelParticipantsQuery['FarcasterChannelParticipants']
  >['FarcasterChannelParticipant']
>[0];
