import classNames from 'classnames';
import { ComponentProps, useState } from 'react';

type LazyImageStatusType = 'loading' | 'loaded' | 'error';

type LazyImageProps = Omit<ComponentProps<'img'>, 'src'> & {
  src?: string | undefined | null;
  fallbackSrc?: string | undefined | null;
};

const LazyImage = ({ src, fallbackSrc, ...rest }: LazyImageProps) => {
  const [status, setStatus] = useState<LazyImageStatusType>('error');
  return (
    <>
      {status === 'error' && (
        <img
          {...rest}
          className={classNames(rest.className)}
          src={fallbackSrc || 'images/placeholder.svg'}
        />
      )}
      {status === 'loading' && (
        <div
          className={classNames('animate-pulse bg-secondary', rest.className)}
          style={{ height: rest.height, width: rest.width }}
        />
      )}
      <img
        {...rest}
        src={src || fallbackSrc || ''}
        style={status !== 'loaded' ? { display: 'none' } : undefined}
        onLoadStart={() => setStatus('loading')}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
      />
    </>
  );
};
export default LazyImage;
