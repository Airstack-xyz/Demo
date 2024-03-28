import { Image } from '@/Components/Image';
import { getAccessToken } from '@privy-io/react-auth';
import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { shortenUrl } from '../../hooks/useShortenURL';
import { CopyButton } from '../CopyButton';
import { debouncePromise } from '../Input/utils';
import { FrameLabel } from './FrameLabel';
import { Link } from '@/page-views/Home/components/Link';
import { Icon } from '../Icon';

const frameUrlCache = new Map<string, string>();

type FrameURLProps = {
  longUrl: string;
  placeholder?: string;
  showLoading?: boolean;
  containerClass?: string;
};

const FETCH_DELAY = 1000;
const CAST_MESSAGE = 'Check out this frame!';

export function FrameURL({
  longUrl,
  placeholder,
  showLoading,
  containerClass
}: FrameURLProps) {
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState('');

  const shortenUrlFn = useCallback(async (url: string) => {
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
  }, []);

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
  const url = shortUrl || placeholder;

  const castUrl = useMemo(() => {
    const encodedUrl = encodeURIComponent('[]=' + url || '');
    return `https://warpcast.com/~/compose?embeds${encodedUrl}&text=${CAST_MESSAGE}`;
  }, [url]);

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
            'w-full flex items-center pl-5 pr-2 h-9 bg-[#132838] rounded-full overflow-x-scroll no-scrollbar whitespace-nowrap flex-1',
            {
              'text-white': shortUrl,
              'justify-center': showLoader
            }
          )}
        >
          {showLoader ? (
            <Image alt="" src="images/loader.svg" height={20} width={30} />
          ) : (
            <span className="flex-1 ellipsis"> {url}</span>
          )}
          {!showLoader && (
            <CopyButton
              className="bg-glass-new size-6 flex-row-center rounded-full"
              value={url || ''}
            />
          )}
        </div>
        <Link
          to={castUrl}
          className={classNames(
            'w-40 rounded-18 bg-button-primary hover:opacity-70 transition-opacity active:opacity-80 flex-row-center gap-2 px-2.5 h-[35px] text-xs text-white font-semibold',
            {
              'opacity-50 pointer-events-none': showLoader
            }
          )}
        >
          <Icon name="farcaster-flat" /> <span>Share to Warpcast</span>
        </Link>
      </div>
    </div>
  );
}
