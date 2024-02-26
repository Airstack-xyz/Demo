import { capitalizeFirstLetter, formatAddress } from '../../../utils';
import { FrameButton } from '../FramePreview';
import { DECODED_TOKEN_TYPE, DECODED_BLOCKCHAIN } from '../constants';
import { Wallet } from './types';

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
  if (lens) return formatAddress(lens, 'lens');

  return identity;
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

export const getFrameButtons = (buttonValues: string[]) => {
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
