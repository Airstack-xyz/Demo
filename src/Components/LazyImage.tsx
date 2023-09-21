import { ComponentProps, useState } from 'react';

const PLACEHOLDER_URL = 'images/placeholder.svg';

const LazyImage = ({
  src,
  placeholderSrc,
  alt,
  ...rest
}: {
  src?: string;
  placeholderSrc?: string;
  alt?: string;
} & ComponentProps<'img'>) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const showPlaceholder = isLoading || isError;

  return (
    <>
      {showPlaceholder && (
        <img
          {...rest}
          src={placeholderSrc || PLACEHOLDER_URL}
          alt="placeholder-img"
        />
      )}
      <img
        {...rest}
        src={src}
        alt={alt}
        style={showPlaceholder ? { display: 'none' } : undefined}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsError(true)}
      />
    </>
  );
};
export default LazyImage;
