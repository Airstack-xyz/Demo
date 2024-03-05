import NextLink from 'next/link';
import { ComponentProps } from 'react';

export function Link(
  props: Omit<ComponentProps<typeof NextLink>, 'href'> & {
    to:
      | string
      | {
          pathname: string;
          search: string;
        };
  }
) {
  const href =
    typeof props.to === 'string'
      ? props.to
      : `${props.to.pathname}${props.to.search ? `?${props.to.search}` : ''}`;
  return <NextLink href={href} {...props} />;
}
