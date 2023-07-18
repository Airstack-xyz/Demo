import { Asset as AirstackAsset } from '@airstack/airstack-react';
import { ComponentProps, useState } from 'react';

function Image(props: ComponentProps<'img'>) {
  const [error, setError] = useState(false);
  if (error || !props.src) {
    return <img {...props} src="images/placeholder.svg" />;
  }
  return <img onError={() => setError(true)} {...props} />;
}

type AssetProps = ComponentProps<typeof AirstackAsset> & {
  image?: string;
};

export function Asset({ image, ...props }: AssetProps) {
  if (image) {
    return <Image src={image} />;
  }

  return (
    <AirstackAsset
      preset="medium"
      error={<img src="images/placeholder.svg" alt="error" />}
      loading={<img src="images/placeholder.svg" alt="loadig" />}
      {...props}
    />
  );
}
