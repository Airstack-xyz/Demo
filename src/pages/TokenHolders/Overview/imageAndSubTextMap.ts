export const imageAndSubTextMap: Record<
  string,
  {
    image?: string;
    subText: string;
  }
> = {
  owners: {
    subText: 'own'
  },
  lens: {
    image: '/images/lens.svg',
    subText: 'have Lens profiles'
  },
  farcaster: {
    image: '/images/farcaster.svg',
    subText: 'have Farcaster profiles'
  },
  ens: {
    image: '/images/ens.svg',
    subText: 'have ENS names'
  },
  primaryEns: {
    image: '/images/ens.svg',
    subText: 'have Primary ENS'
  },
  xmtp: {
    image: '/images/xmtp.svg',
    subText: 'have XMTP'
  }
};
