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
  // TODO: there is no image for gnosis chain in the api, so we use a placeholder, remove this when we have the image
  if ((props.chain as string) === 'gnosis') {
    return <Image src={image} />;
  }

  return (
    <AirstackAsset
      preset="medium"
      error={
        image ? (
          <Image src={image} />
        ) : (
          <img src="images/placeholder.svg" alt="error" />
        )
      }
      loading={<img src="images/placeholder.svg" alt="loadig" />}
      {...props}
    />
  );
}
