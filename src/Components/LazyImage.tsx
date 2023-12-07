import classNames from 'classnames';
import { ComponentProps, useState } from 'react';

type LazyImageStatusType = 'loading' | 'loaded' | 'error';
type Props = ComponentProps<'img'> & {
  errorPlaceholderClassName?: string;
};

const LazyImage = ({
  src,
  alt,
  ...rest
}: {
  src?: string;
  alt?: string;
} & Props) => {
  const [status, setStatus] = useState<LazyImageStatusType>('error');
  return (
    <>
      {status === 'error' && (
        <img
          {...rest}
          className={classNames(rest.className, rest.errorPlaceholderClassName)}
          src="images/placeholder.svg"
          alt="placeholder-img"
        />
      )}
      {status === 'loading' && (
        <div className="skeleton-loader">
          <div
            data-loader-type="block"
            style={{ height: rest.height, width: rest.width }}
            className={rest.className}
          />
        </div>
      )}
      <img
        {...rest}
        src={src}
        alt={alt}
        style={status !== 'loaded' ? { display: 'none' } : undefined}
        onLoadStart={() => setStatus('loading')}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
      />
    </>
  );
};
export default LazyImage;
