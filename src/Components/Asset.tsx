import { Asset as AirstackAsset } from '@airstack/airstack-react';
import { ComponentProps, useState } from 'react';
import { checkBlockchainSupportForToken } from '../utils/activeTokenInfoString';
import { isMobileDevice } from '../utils/isMobileDevice';

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

export function Asset({
  image,
  useImageOnError,
  videoProps,
  ...props
}: AssetProps) {
  const isMobile = isMobileDevice();

  if (
    !checkBlockchainSupportForToken(props.chain) || // check if blockchain is supported for token apis
    !props.address ||
    !props.tokenId
  ) {
    return <Image {...props.imgProps} src={image} />;
  }

  return (
    <AirstackAsset
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
      videoProps={{
        maxDurationForAutoPlay: isMobile ? 0 : 10, // !Important: Don't autoplay video on mobile device
        ...videoProps
      }}
      {...props}
    />
  );
}
