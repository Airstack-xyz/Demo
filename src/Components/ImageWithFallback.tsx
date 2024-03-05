import { Image, ImageProps } from '@/Components/Image';
import { useState } from 'react';

export default function ImageWithFallback({
  fallback,
  src,
  ...props
}: {
  src: string | undefined | null;
  fallback: string;
} & Omit<ImageProps, 'src'>) {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src || fallback);
  const onError = () => setImgSrc(fallback);
  return (
    <Image src={imgSrc ? imgSrc : fallback} onError={onError} {...props} />
  );
}
