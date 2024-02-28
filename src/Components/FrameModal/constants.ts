export const FRAMES_ENDPOINT = process.env.FRAMES_ENDPOINT || '';

export const TOKEN_PLACEHOLDER_URL = 'images/placeholder-blue.svg';

export const PROFILE_PLACEHOLDER_URL = 'images/profile-placeholder.svg';

export const ENCODED_TOKEN_TYPE = {
  POAP: '1',
  NFT: '2',
  ERC20: '3',
  ERC721: '4',
  ERC1155: '5',
  ERC6551: '6'
};

export const ENCODED_BLOCKCHAIN = {
  ethereum: '1',
  polygon: '2',
  zora: '3',
  base: '4',
  gnosis: '5'
};

export const DECODED_TOKEN_TYPE: Record<string, string> = {
  '1': 'POAP',
  '2': 'NFT',
  '3': 'ERC20',
  '4': 'ERC721',
  '5': 'ERC1155',
  '6': 'ERC6551'
};

export const DECODED_BLOCKCHAIN: Record<string, string> = {
  '1': 'ethereum',
  '2': 'polygon',
  '3': 'zora',
  '4': 'base',
  '5': 'gnosis'
};
