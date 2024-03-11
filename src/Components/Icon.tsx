import { Image, ImageProps } from '@/Components/Image';

type ImgProps = Omit<ImageProps, 'src' | 'alt'>;

export type IconType =
  | 'nft'
  | 'nft-gray'
  | 'poap-flat'
  | 'nft-flat'
  | 'socials-flat'
  | 'close'
  | 'input-tokens'
  | 'input-poap'
  | 'ethereum'
  | 'polygon'
  | 'gnosis'
  | 'base'
  | 'zora'
  | 'token-balances'
  | 'token-holders'
  | 'erc20'
  | 'arrow-right-round'
  | 'count-loader'
  | 'arrow-down'
  | 'xmtp'
  | 'table-view'
  | 'filter'
  | 'copy'
  | 'copy-white'
  | 'sort'
  | 'blockchain-filter'
  | 'check-mark'
  | 'search'
  | 'tools'
  | 'calendar'
  | 'clock'
  | 'block'
  | 'eye'
  | 'holder-white'
  | 'stack'
  | 'token-holders-white'
  | 'folder'
  | 'folder-gray'
  | 'check-mark-circle'
  | 'refresh-blue'
  | 'grid-view'
  | 'list-view'
  | 'bullseye'
  | 'xmtp-grey'
  | 'ens-grey'
  | 'farcaster-grey'
  | 'lens-grey'
  | 'nft-common'
  | 'token-sent'
  | 'poap-common'
  | 'farcaster'
  | 'lens'
  | 'community'
  | 'info-circle'
  | 'overview'
  | 'follow-purple'
  | 'mutual-follow'
  | 'follower-gray'
  | 'following-gray'
  | 'settings-gray'
  | 'pause-circle'
  | 'cancel-circle'
  | 'file-arrow-down'
  | 'chain'
  | 'frame'
  | 'customize'
  | 'channels'
  | 'docs'
  | 'sdk'
  | 'api'
  | 'csv'
  | 'x'
  | 'github'
  | 'linkedin'
  | 'warpcast'
  | 'frames'
  | 'ai-robot'
  | 'hamburger'
  | 'user' 
  | 'wallet' ;

export type IconProps = {
  name: IconType;
  alt?: string;
} & ImgProps;

export function Icon({ name, ...props }: IconProps) {
  return (
    <Image
      src={`images/icons/${name}.svg`}
      alt={name}
      height={20}
      width={20}
      {...props}
    />
  );
}
