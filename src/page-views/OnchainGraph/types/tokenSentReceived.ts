import { TokenBlockchain } from '../../../types';
import { Domain, Social } from './index';

export type TokenQueryResponse = {
  [Key in TokenBlockchain]: TokenSent;
};

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
