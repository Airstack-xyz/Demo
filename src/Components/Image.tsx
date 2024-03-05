import NextImage from 'next/image';
import { ComponentProps } from 'react';

export type ImageProps = Omit<ComponentProps<typeof NextImage>, 'alt'> & {
  alt?: string;
};

export function Image(props: ImageProps) {
  return <NextImage height={20} width={20} {...props} alt={props.alt || ''} />;
}
