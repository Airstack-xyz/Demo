import { Social } from '../types';

export interface PoapsByEventIdsQueryResponse {
  Poaps: Poaps;
}

export interface UserPoapsEventIdsQueryResponse {
  Poaps: {
    Poap: {
      eventId: string;
    }[];
  };
}

export interface Poaps {
  Poap: Poap[];
}

export interface Poap {
  eventId: string;
  poapEvent: PoapEvent;
  attendee: Attendee;
}

export interface PoapEvent {
  eventName: string;
  contentValue: ContentValue;
}

export interface ContentValue {
  image: Image;
}

export interface Image {
  extraSmall: string;
}

export interface Attendee {
  owner: Owner;
}

export interface Owner {
  addresses: string[];
  domains?: Domain[];
  socials?: Social[];
  xmtp?: Xmtp[];
}

export interface Domain {
  name: string;
}

export interface Xmtp {
  isXMTPEnabled: boolean;
}

export interface PageInfoCursor {
  prevCursor: string;
  nextCursor: string;
}
