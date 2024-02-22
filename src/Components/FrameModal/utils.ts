import { capitalizeFirstLetter, formatAddress } from '../../utils';
import { encode } from '../../utils/encode';
import { FrameButton } from './FramePreview';
import { DECODED_BLOCKCHAIN, DECODED_TOKEN_TYPE } from './constants';
import { Wallet } from './types';

export const encodeFrameData = (data: Record<string, string>) => {
  const stringifiedData = JSON.stringify(data);
  return encode(stringifiedData);
};

export const getResolvedOwner = (wallet: Wallet | undefined) => {
  if (!wallet) return '';

  const farcaster = wallet.farcasterSocials?.[0]?.profileName;
  const primaryEns = wallet.primaryDomain?.name;
  const ens = wallet.domains?.[0]?.name;
  const lens = wallet.lensSocials?.[0]?.profileName;
  const identity = wallet.identity;

  if (farcaster) return formatAddress(farcaster, 'farcaster');
  if (primaryEns) return formatAddress(primaryEns, 'ens');
  if (ens) return formatAddress(ens, 'ens');
  if (lens) return formatAddress(lens, 'ens');

  return identity;
};

export const getDisplayName = (address: string | undefined) => {
  if (!address) return address;

  if (address.startsWith('lens/')) return address.replace('lens/', '');
  if (address.startsWith('fc_fname:')) return address.replace('fc_fname:', '');

  return address;
};

export const getDecodedButtonValue = (buttonValue: string) => {
  const [tokenTypePart, blockchainPart] = buttonValue.split('-') || '';

  const encodedTokenType = tokenTypePart || '';
  const encodedBlockchain = blockchainPart || '';

  const tokenType = DECODED_TOKEN_TYPE[encodedTokenType] || '';
  const blockchain = DECODED_BLOCKCHAIN[encodedBlockchain] || '';

  return {
    tokenType,
    blockchain
  };
};

export const getFrameButtonsForTokenBalances = (buttonValues: string[]) => {
  const buttons: FrameButton[] = [];

  buttonValues.forEach(value => {
    if (!value) {
      return;
    }
    const { tokenType, blockchain } = getDecodedButtonValue(value);
    if (tokenType === 'poap') {
      buttons.push({
        type: 'post',
        label: '+ POAPs'
      });
      return;
    }
    if (tokenType === 'nft') {
      buttons.push({
        type: 'post',
        label: `+ ${capitalizeFirstLetter(blockchain)}`
      });
    }
  });

  buttons.push({
    type: 'link',
    label: 'View All'
  });

  return buttons;
};
