import { usePrivy } from '@privy-io/react-auth';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { shortenUrl } from '../../hooks/useShortenURL';
import { RoundedCopyButton } from '../CopyButton';
import { FrameLabel } from './FrameLabel';

const frameUrlCache = new Map<string, string>();

export function FrameURL({
  longUrl,
  placeholder,
  showLoading,
  containerClass
}: {
  longUrl: string;
  placeholder?: string;
  showLoading?: boolean;
  containerClass?: string;
}) {
  const auth = usePrivy();
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState('');

  const longUrlRef = useRef(longUrl);

  longUrlRef.current = longUrl;

  useEffect(() => {
    async function shortenUrlFunction() {
      if (longUrl) {
        if (frameUrlCache.has(longUrl)) {
          const shortenedUrl = frameUrlCache.get(longUrl) || '';

          if (longUrlRef.current !== longUrl) return;
          setShortUrl(shortenedUrl);
          return;
        }

        if (longUrlRef.current !== longUrl) return;
        setLoading(true);

        const token = await auth?.getAccessToken();

        const { data, error } = await shortenUrl(longUrl, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (error) {
          if (longUrlRef.current !== longUrl) return;
          setShortUrl(longUrl);
          setLoading(false);
          return;
        }

        const shortenedUrl = data?.shortenedUrl || '';
        frameUrlCache.set(longUrl, shortenedUrl);

        if (longUrlRef.current !== longUrl) return;
        setShortUrl(shortenedUrl);
        setLoading(false);
      } else {
        if (longUrlRef.current !== longUrl) return;
        setShortUrl('');
      }
    }

    shortenUrlFunction();
  }, [auth, longUrl]);

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
            'w-full flex items-center px-5 h-9 bg-glass-2 rounded-full overflow-x-scroll no-scrollbar whitespace-nowrap max-w-[512px]',
            {
              'text-white': shortUrl,
              'justify-center': showLoader
            }
          )}
        >
          {showLoader ? (
            <img src="images/loader.svg" height={20} width={30} />
          ) : (
            <span> {shortUrl || placeholder}</span>
          )}
        </div>
        <RoundedCopyButton value={showLoader ? '' : shortUrl} />
      </div>
    </div>
  );
}
