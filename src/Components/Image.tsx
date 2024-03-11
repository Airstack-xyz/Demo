import NextImage from 'next/image';
import { ComponentProps } from 'react';

export type ImageProps = Omit<ComponentProps<typeof NextImage>, 'alt'> & {
  alt?: string;
};

export function Image(props: ImageProps) {
  return (
    // using next Image component will autmatically optimize images,
    // which is causing issues with some images, so for now we are using the img tag
    // @ts-ignore
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt || ''} />
  );
}
