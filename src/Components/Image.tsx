import classNames from 'classnames';
import NextImage from 'next/image';
import { ComponentProps } from 'react';

export type ImageProps = Omit<ComponentProps<typeof NextImage>, 'alt'> & {
  alt?: string;
};

export function Image(props: ImageProps) {
  return (
    <NextImage
      height={20}
      width={20}
      {...props}
      className={classNames(
        props.className?.includes('-w') ? '' : 'w-auto', // If the className includes a width, don't add w-auto
        props.className
      )}
      alt={props.alt || ''}
    />
  );
}
