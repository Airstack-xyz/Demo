import { capitalizeFirstLetter, formatAddress } from '../../utils';
import { encode } from '../../utils/encode';
import { FrameButton } from './FramePreview';
import { Wallet } from './types';

export const encodeFrameData = (data: Record<string, string>) => {
  const stringifiedData = JSON.stringify(data);
  return encode(stringifiedData);
};

export const getResolvedOwner = (wallet: Wallet) => {
  const farcaster = wallet.farcasterSocials?.[0]?.profileName;
  const primaryEns = wallet.primaryDomain?.name;
  const ens = wallet.domains?.[0]?.name;
  const lens = wallet.lensSocials?.[0]?.profileName;
  const identity = wallet.identity;

  if (farcaster) {
    return {
      display: farcaster,
      address: formatAddress(farcaster, 'farcaster')
    };
  }
  if (primaryEns) {
    return {
      display: primaryEns,
      address: formatAddress(primaryEns, 'ens')
    };
  }
  if (ens) {
    return {
      display: ens,
      address: formatAddress(ens, 'ens')
    };
  }
  if (lens) {
    return {
      display: lens,
      address: formatAddress(lens, 'lens')
    };
  }

  return {
    display: identity,
    address: identity
  };
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
