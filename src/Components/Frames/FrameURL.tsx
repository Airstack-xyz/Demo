import { Image } from '@/Components/Image';
import { getAccessToken } from '@privy-io/react-auth';
import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { shortenUrl } from '../../hooks/useShortenURL';
import { RoundedCopyButton } from '../CopyButton';
import { debouncePromise } from '../Input/utils';
import { FrameLabel } from './FrameLabel';

const frameUrlCache = new Map<string, string>();

type FrameURLProps = {
  longUrl: string;
  placeholder?: string;
  showLoading?: boolean;
  containerClass?: string;
};

const FETCH_DELAY = 1000;

export function FrameURL({
  longUrl,
  placeholder,
  showLoading,
  containerClass
}: FrameURLProps) {
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState('');

  const shortenUrlFn = useCallback(
    async (url: string) => {
      if (!url) {
        setShortUrl('');
        setLoading(false);
        return;
      }

      if (frameUrlCache.has(url)) {
        const shortenedUrl = frameUrlCache.get(url) || '';
        setShortUrl(shortenedUrl);
        setLoading(false);
        return;
      }

      setLoading(true);

      const token = await getAccessToken();

      const { data, error } = await shortenUrl(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (error) {
        setShortUrl(url);
        setLoading(false);
        return;
      }

      const shortenedUrl = data?.shortenedUrl || '';
      frameUrlCache.set(url, shortenedUrl);

      setShortUrl(shortenedUrl);
      setLoading(false);
    },
    []
  );

  const debouncedShortenUrlFn = useMemo(
    () => debouncePromise(shortenUrlFn, FETCH_DELAY),
    [shortenUrlFn]
  );

  useEffect(() => {
    if (longUrl) {
      setLoading(true);
      debouncedShortenUrlFn(longUrl);
    }
  }, [debouncedShortenUrlFn, longUrl]);

  const showLoader = loading || showLoading;

  return (
    <div
      className={classNames(
        'text-text-secondary text-xs relative',
        containerClass
      )}
    >
      <FrameLabel label="Frame URL" labelIcon="chain" labelIconSize={16} />
      <div className="flex items-center justify-between gap-4">
        <div
          className={classNames(
            'w-full flex items-center px-5 h-9 bg-[#132838] rounded-full overflow-x-scroll no-scrollbar whitespace-nowrap max-w-[512px]',
            {
              'text-white': shortUrl,
              'justify-center': showLoader
            }
          )}
        >
          {showLoader ? (
            <Image alt="" src="images/loader.svg" height={20} width={30} />
          ) : (
            <span> {shortUrl || placeholder}</span>
          )}
        </div>
        <RoundedCopyButton value={showLoader ? '' : shortUrl} />
      </div>
    </div>
  );
}