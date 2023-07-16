import { Asset as AirstackAsset } from '@airstack/airstack-react';
import { ComponentProps } from 'react';

export function Asset(props: ComponentProps<typeof AirstackAsset>) {
  return (
    <AirstackAsset
      preset="medium"
      error={<img src="images/placeholder.svg" />}
      loading={<img src="images/placeholder.svg" />}
      {...props}
    />
  );
}