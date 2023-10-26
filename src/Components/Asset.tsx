import { Asset as AirstackAsset } from '@airstack/airstack-react';
import { ComponentProps, useState } from 'react';

export function Image(props: ComponentProps<'img'>) {
  const [error, setError] = useState(false);
  if (error || !props.src) {
    return (
      <img
        data-type="image-error-placeholder"
        {...props}
        src="images/placeholder.svg"
      />
    );
  }
  return (
    <img data-type="placeholder" onError={() => setError(true)} {...props} />
  );
}

type AssetProps = ComponentProps<typeof AirstackAsset> & {
  image?: string;
  useImageOnError?: boolean;
};

export function Asset({ image, useImageOnError, ...props }: AssetProps) {
  // TODO: using error count to prevent infinite api calls on error, this is a temporary fix, this needs to be fixed in the SDK
  const [errorCount, setErrorCount] = useState(0);
  // TODO: there is no image for gnosis chain in the api, so we use a placeholder, remove this when we have the image
  if (
    errorCount > 1 ||
    (props.chain as string) === 'gnosis' ||
    !props.address ||
    !props.tokenId
  ) {
    return <Image {...props.imgProps} src={image} />;
  }

  return (
    <AirstackAsset
      onError={() => {
        setErrorCount(count => count + 1);
      }}
      preset="medium"
      error={
        useImageOnError && image ? (
          <Image {...props.imgProps} src={image} />
        ) : (
          <img
            {...props.imgProps}
            src="images/placeholder.svg"
            data-type="error-placeholder"
            alt="error"
          />
        )
      }
      loading={
        <img
          {...props.imgProps}
          src="images/placeholder.svg"
          data-type="loading-placeholder"
          alt="loading"
        />
      }
      {...props}
    />
  );
}
