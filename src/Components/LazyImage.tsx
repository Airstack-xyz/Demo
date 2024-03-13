import classNames from 'classnames';
import { ComponentProps, useState } from 'react';
import { Image } from '@/Components/Image';

type LazyImageStatusType = 'loading' | 'loaded' | 'error';

type LazyImageProps = Omit<ComponentProps<'img'>, 'src'> & {
  src?: string | null;
  fallbackSrc?: string;
  fallbackClassName?: string;
  loadingClassName?: string;
};

const LazyImage = ({
  src,
  fallbackSrc = 'images/token-placeholder.svg',
  fallbackClassName,
  loadingClassName,
  ...rest
}: LazyImageProps) => {
  const [status, setStatus] = useState<LazyImageStatusType>('error');
  return (
    <>
      {status === 'error' && (
        // @ts-ignore
        <Image
          alt="error"
          {...rest}
          className={classNames(rest.className, fallbackClassName)}
          src={fallbackSrc}
        />
      )}
      {status === 'loading' && (
        <div
          className={classNames(
            'animate-pulse bg-secondary',
            rest.className,
            loadingClassName
          )}
          style={{ height: rest.height, width: rest.width }}
        />
      )}
      {/* @ts-ignore */}
      <Image
        alt=""
        {...rest}
        src={src || fallbackSrc}
        style={status !== 'loaded' ? { display: 'none' } : undefined}
        onLoadStart={() => setStatus('loading')}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
      />
    </>
  );
};
export default LazyImage;
