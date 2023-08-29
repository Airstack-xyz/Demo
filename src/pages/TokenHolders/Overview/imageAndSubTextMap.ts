export const imageAndSubTextMap: Record<
  string,
  {
    image?: string;
    subText: string;
    name: string;
  }
> = {
  owners: {
    subText: 'own',
    name: ''
  },
  lens: {
    image: '/images/lens.svg',
    subText: 'have Lens profiles',
    name: 'Lens'
  },
  farcaster: {
    image: '/images/farcaster.svg',
    subText: 'have Farcaster profiles',
    name: 'Farcaster'
  },
  ens: {
    image: '/images/ens.svg',
    subText: 'have ENS names',
    name: 'ENS'
  },
  primaryEns: {
    image: '/images/ens.svg',
    subText: 'have Primary ENS',
    name: 'primary ENS'
  },
  xmtp: {
    image: '/images/xmtp.svg',
    subText: 'have XMTP',
    name: 'XMTP'
  }
};
