import { Image, ImageProps } from '@/Components/Image';

type ImgProps = Omit<ImageProps, 'src' | 'alt'>;

export type IconType =
  | 'allow-list'
  | 'farcaster-kit'
  | 'no-code-frame'
  | 'recommended-mints'
  | 'resolvers'
  | 'tokens-common'
  | 'combinations'
  | 'frames-captcha'
  | 'on-chain-graph'
  | 'recommended-swaps'
  | 'frames-sdk'
  | 'universal-contacts'
  | 'facaster-frames'
  | 'frames-validator'
  | 'frames-get-started'
  | 'on-chain'
  | 'recommended-tokens'
  | 'social-follows'
  | 'farcaser-api'
  | 'historical-snapshot'
  | 'recommeded-daps'
  | 'recommended-users'
  | 'spam-filter'
  | 'abstraction-modules'
  | 'lookalikes'
  | 'accounts'
  | 'balances'
  | 'holders'
  | 'transfers'
  | 'mints'
  | 'tokens'
  | 'events'
  | 'ethereum'
  | 'polygon'
  | 'base'
  | 'zora'
  | 'optimism'
  | 'ai-query'
  | 'ai-api'
  | 'ens'
  | 'xmtp'
  | 'bonfire'
  | 'builder-fi'
  | 'buttrfly'
  | 'chaijet'
  | 'coinbase'
  | 'converse'
  | 'firefly'
  | 'gandalf'
  | 'gold'
  | 'holder'
  | 'icebreaker'
  | 'karama'
  | 'lens'
  | 'lenspost'
  | 'minglee'
  | 'nfts'
  | 'orb'
  | 'payflow'
  | 'phala-network'
  | 'poaps'
  | 'receipts'
  | 'syndicate'
  | 'tokenbound'
  | 'union-finance'
  | 'unlonely'
  | 'unstoppable-domains'
  | 'farcaster'
  | 'neura-name'
  | 'socials'
  | 'chain'
  // footer icons
  | 'docs'
  | 'api'
  | 'sdk'
  | 'github'
  | 'warpcast'
  | 'x'
  | 'linkedin'
  | 'hypeshot';

export type IconProps = {
  name: IconType;
  alt?: string;
} & ImgProps;

export function Icon({ name, ...props }: IconProps) {
  return (
    <Image
      src={`images/home/${name}.svg`}
      alt={name}
      height={20}
      width={20}
      loading={props.loading || 'lazy'}
      {...props}
    />
  );
}
