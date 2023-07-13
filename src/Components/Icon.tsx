type ImageProps = Omit<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >,
  'src' | 'alt'
>;

export type IconType =
  | 'nft'
  | 'nft-gray'
  | 'address-wallet'
  | 'poap-flat'
  | 'nft-flat'
  | 'socials-flat'
  | 'close'
  | 'input-tokens'
  | 'input-poap'
  | 'ethereum'
  | 'polygon'
  | 'gnosis';

export type IconProps = {
  name: IconType;
  alt?: string;
} & ImageProps;

export function Icon({ name, ...props }: IconProps) {
  return (
    <img
      src={`images/icons/${name}.svg`}
      alt={name}
      height={20}
      width={20}
      {...props}
    />
  );
}
