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
  | 'sdk'
  | 'universal-contacts'
  | 'facaster-frames'
  | 'frames-validator'
  | 'on-chain'
  | 'recommended-tokens'
  | 'social-follows'
  | 'farcaser-api'
  | 'historical-snapshot'
  | 'recommeded-daps'
  | 'recommended-users'
  | 'spam-filter'
  | 'abstraction-modules'
  | 'lookalikes';

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
      {...props}
    />
  );
}
