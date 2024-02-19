import { capitalizeFirstLetter, formatAddress } from '../../utils';
import { encode } from '../../utils/encode';
import { FrameButton } from './FramePreview';
import { Wallet } from './types';

export const encodeFrameData = (data: Record<string, string>) => {
  const stringifiedData = JSON.stringify(data);
  return encode(stringifiedData);
};

export const getResolvedOwner = (wallet: Wallet) => {
  const primaryEns = wallet?.primaryDomain?.name;
  const ens = wallet?.domains?.[0]?.name;
  const farcasterProfile = wallet?.farcasterSocials?.[0]?.profileName;
  const lensProfile = wallet?.lensSocials?.[0]?.profileName;
  const identity = wallet?.identity;

  if (primaryEns) {
    return formatAddress(primaryEns, 'ens');
  }
  if (ens) {
    return formatAddress(ens, 'ens');
  }
  if (farcasterProfile) {
    return formatAddress(farcasterProfile, 'farcaster');
  }
  if (lensProfile) {
    return formatAddress(lensProfile, 'lens');
  }

  return identity;
};

export const getFrameButtonsForTokenBalances = (buttonValues: string[]) => {
  const buttons: FrameButton[] = [];

  buttonValues.forEach(value => {
    const [tokenType, blockchain] = value.split('-');
    if (tokenType === 'poap') {
      buttons.push({
        type: 'post',
        label: 'More POAPs'
      });
      return;
    }
    if (tokenType === 'nft') {
      buttons.push({
        type: 'post',
        label: `More NFTs on ${capitalizeFirstLetter(blockchain)}`
      });
      return;
    }
  });

  buttons.push({
    type: 'link',
    label: 'View All'
  });

  return buttons;
};
