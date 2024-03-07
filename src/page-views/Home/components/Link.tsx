import { Link as DefaultLink, LinkProps } from '@/Components/Link';

export function Link(props: LinkProps) {
  return <DefaultLink {...props} target={props.target || '_blank'} />;
}
