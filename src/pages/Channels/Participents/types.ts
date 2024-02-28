import {
  FarcasterChannelParticipantsQuery,
  ParticipantsSocialsQuery
} from '../../../../__generated__/airstack-types';

export type ParticipentType = NonNullable<
  NonNullable<
    FarcasterChannelParticipantsQuery['FarcasterChannelParticipants']
  >['FarcasterChannelParticipant']
>[0];

export type Social = NonNullable<
  NonNullable<ParticipantsSocialsQuery['Socials']>['Social']
>[0];
