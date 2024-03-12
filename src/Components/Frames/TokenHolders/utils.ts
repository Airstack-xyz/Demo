import { FrameButton } from '../FramePreview';
import { getProfileDisplayName } from '../utils';
import { Owner, Poap, TokenBalance } from './types';

export const getResolvedHolderData = (owner: Owner | undefined) => {
  if (!owner) return undefined;

  const farcaster = owner.farcasterSocials?.[0]?.profileName;
  const primaryEns = owner.primaryDomain?.name;
  const ens = owner.domains?.[0]?.name;
  const lens = owner.lensSocials?.[0]?.profileName;
  const identity = owner.identity;

  if (farcaster) {
    return {
      name: getProfileDisplayName(farcaster),
      type: 'farcaster'
    };
  }
  if (primaryEns) {
    return {
      name: getProfileDisplayName(primaryEns),
      type: 'ens'
    };
  }
  if (ens) {
    return {
      name: getProfileDisplayName(ens),
      type: 'ens'
    };
  }
  if (lens) {
    return {
      name: getProfileDisplayName(lens),
      type: 'lens'
    };
  }

  return {
    name: identity,
    type: ''
  };
};

export const getResolvedHolderImage = (owner: Owner | undefined) => {
  if (!owner) return '';

  const farcaster =
    owner.farcasterSocials?.[0]?.profileImageContentValue?.image?.small;
  const primaryEns = owner.primaryDomain?.avatar;
  const ens = owner.domains?.[0]?.avatar;
  const lens = owner.lensSocials?.[0]?.profileImageContentValue?.image?.small;

  if (farcaster) return farcaster;
  if (primaryEns) return primaryEns;
  if (ens) return ens;
  if (lens) return lens;

  return undefined;
};

export const getFrameButtons = (items?: TokenBalance[] | Poap[]) => {
  if (!items?.length) return [];

  const buttons: FrameButton[] = [];

  const resolvedHolder1 = getResolvedHolderData(items?.[0]?.owner);
  const resolvedHolder2 = getResolvedHolderData(items?.[1]?.owner);

  if (resolvedHolder1) {
    buttons.push({
      type: 'post',
      label: resolvedHolder1?.name || ''
    });
  }

  if (resolvedHolder2) {
    buttons.push({
      type: 'post',
      label: resolvedHolder2?.name || ''
    });
  }

  buttons.push(
    {
      type: 'post',
      label: 'Next'
    },
    {
      type: 'link',
      label: 'View All'
    }
  );

  return buttons;
};
