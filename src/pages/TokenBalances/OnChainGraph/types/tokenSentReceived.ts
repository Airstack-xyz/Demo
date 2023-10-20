import { Social } from '../types';

export interface TokenQueryResponse {
  Ethereum: TokenSent;
  Polygon: TokenSent;
}

export interface TokenSent {
  TokenTransfer: TokenTransfer[];
}

export interface TokenTransfer {
  account?: Transfer;
}

export interface Transfer {
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
