import { ComponentProps, useState } from 'react';

export default function ImageWithFallback({
  fallback,
  src,
  ...props
}: {
  src: string | undefined | null;
  fallback: string;
} & Omit<ComponentProps<'img'>, 'src'>) {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src || fallback);
  const onError = () => setImgSrc(fallback);
  return <img src={imgSrc ? imgSrc : fallback} onError={onError} {...props} />;
}
