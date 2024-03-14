import { Image, ImageProps } from './Image';

export function GlowImage({
  position,
  ...imageProps
}: Omit<ImageProps, 'src'> & {
  position: 'top' | 'bottom';
}) {
  return (
    <Image
      src={`/images/glow-${position}.svg`}
      {...imageProps}
      loading="lazy"
    />
  );
}
