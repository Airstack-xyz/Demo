export const ENCODED_TOKEN_TYPE = {
  POAP: '1',
  NFT: '2',
  ERC20: '3'
};

export const ENCODED_BLOCKCHAIN = {
  ETHEREUM: '1',
  POLYGON: '2',
  ZORA: '3',
  BASE: '4'
};

export const DECODED_TOKEN_TYPE: Record<string, string> = {
  '1': 'poap',
  '2': 'nft',
  '3': 'erc20'
};

export const DECODED_BLOCKCHAIN: Record<string, string> = {
  '1': 'ethereum',
  '2': 'polygon',
  '3': 'zora',
  '4': 'base'
};
