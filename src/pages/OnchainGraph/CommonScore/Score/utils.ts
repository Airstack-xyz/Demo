import { Wallet } from '../../../TokenBalances/types';

export function getProfileDataFromSocial(
  social: Wallet | null,
  address: string
) {
  let domain = social?.primaryDomain;

  if (!domain) {
    social?.domains?.forEach(_domain => {
      if (_domain.isPrimary) {
        domain = _domain;
      }
      if (!domain) {
        domain = _domain;
      }
    });
  }

  // prefer input address if it is not an farcaster and is ENS domain
  if (!address.startsWith('fc_fname:') && address.endsWith('.eth') && domain) {
    domain.name = address;
  }

  const lens = social?.lensSocials?.[0] || null;
  const farcaster =
    social?.farcasterSocials?.find(item => item.profileImage) || null;

  return {
    domain: domain || null,
    profile: farcaster?.profileImage ? farcaster : lens || null
  };
}

export function getUniqueAssociatedAddress(socials: Wallet['socials']) {
  const associatedAddresses = socials
    .map(social => social.userAssociatedAddresses)
    .flat();

  return [...new Set(associatedAddresses)];
}
