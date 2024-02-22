import { usePrivy } from '@privy-io/react-auth';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { shortenUrl } from '../../hooks/useShortenURL';
import { showToast } from '../../utils/showToast';
import { RoundedCopyButton } from '../CopyButton';
import { Icon } from '../Icon';

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

  const shortenUrlFunction = useCallback(
    async (longUrl: string) => {
      setLoading(true);

      const token = await auth?.getAccessToken();

      const { data, error } = await shortenUrl(longUrl, {
        Authorization: `Bearer ${token}`
      });

      if (error) {
        setShortUrl('');
        showToast(`Couldn't shorten url`, 'negative');
        setLoading(false);
        return;
      }

      const shortenedUrl = data?.shortenedUrl || '';
      frameUrlCache.set(longUrl, shortenedUrl);
      setShortUrl(shortenedUrl);
      setLoading(false);
    },
    [auth]
  );

  useEffect(() => {
    if (longUrl) {
      if (frameUrlCache.has(longUrl)) {
        const shortenedUrl = frameUrlCache.get(longUrl) || '';
        setShortUrl(shortenedUrl);
        return;
      }
      shortenUrlFunction(longUrl);
    }
  }, [longUrl, shortenUrlFunction]);

  const showLoader = loading || showLoading;

  return (
    <div
      className={classNames(
        'text-text-secondary text-xs relative',
        containerClass
      )}
    >
      <div className="flex items-center gap-1 mb-2">
        <Icon name="chain" height={16} width={16} />
        <span className="font-semibold">Frame URL</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div
          className={classNames(
            'w-full flex items-center px-5 h-9 bg-glass-2 rounded-full overflow-auto no-scrollbar max-w-[512px]',
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
