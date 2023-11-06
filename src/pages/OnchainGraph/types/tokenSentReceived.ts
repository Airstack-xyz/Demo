import { Domain, Social } from './index';

export interface TokenQueryResponse {
  Ethereum: TokenSent;
  Polygon: TokenSent;
  Base: TokenSent;
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

export interface Xmtp {
  isXMTPEnabled: boolean;
}
