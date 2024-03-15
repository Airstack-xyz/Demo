import { Image } from '@/Components/Image';
import { getAccessToken } from '@privy-io/react-auth';
import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useOutsideClick } from '../hooks/useOutsideClick';
import { shortenUrl } from '../hooks/useShortenURL';
import { isMobileDevice } from '../utils/isMobileDevice';
import { showToast } from '../utils/showToast';
import { Icon } from './Icon';
import { Tooltip, tooltipClass } from './Tooltip';

function ShareIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        fill="#65AAD0"
        fillRule="evenodd"
        d="M11.7692 13.9231c-.8922 0-1.6154-.7232-1.6154-1.6154s.7232-1.6154 1.6154-1.6154c.8923 0 1.6154.7232 1.6154 1.6154s-.7231 1.6154-1.6154 1.6154ZM4.2308 9.6154c-.8923 0-1.6154-.7232-1.6154-1.6154 0-.8917.7231-1.6154 1.6154-1.6154.8922 0 1.6153.7237 1.6153 1.6154 0 .8922-.7231 1.6154-1.6153 1.6154Zm7.5384-7.5385c.8923 0 1.6154.7232 1.6154 1.6154s-.7231 1.6154-1.6154 1.6154c-.8922 0-1.6154-.7232-1.6154-1.6154s.7232-1.6154 1.6154-1.6154Zm0 7.5385c-.9531 0-1.785.4981-2.2637 1.2449L6.6221 9.2126c.1863-.3661.301-.7743.301-1.2126 0-.2709-.0523-.5272-.1266-.7738l2.9998-1.7139c.4916.533 1.1905.8723 1.9729.8723 1.4873 0 2.6923-1.205 2.6923-2.6923C14.4615 2.2051 13.2565 1 11.7692 1 10.282 1 9.0769 2.205 9.0769 3.6923c0 .2709.0522.5272.1265.7743L6.2037 6.18c-.4916-.5325-1.1906-.8723-1.973-.8723-1.4872 0-2.6922 1.205-2.6922 2.6923 0 1.4872 1.205 2.6923 2.6923 2.6923.6138 0 1.1733-.2132 1.6261-.5589l-.0108.0204 3.2604 1.8631c-.0107.097-.0296.1906-.0296.2908C9.077 13.7949 10.282 15 11.7692 15c1.4873 0 2.6923-1.2051 2.6923-2.6923 0-1.4872-1.205-2.6923-2.6923-2.6923Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const shareUrlCache = new Map<string, string>();

type ShareURLDropdownProps = {
  dropdownAlignment?: string;
};

export function ShareURLDropdown({
  dropdownAlignment = 'left'
}: ShareURLDropdownProps) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState<string | null>(null);

  const isMobile = isMobileDevice();

  const handleDropdownClose = useCallback(() => {
    setIsDropdownVisible(false);
  }, []);

  const containerRef = useOutsideClick<HTMLDivElement>(handleDropdownClose);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDropdownToggle = useCallback(() => {
    setIsDropdownVisible(prevValue => !prevValue);
  }, []);

  const handleCopyClick = useCallback(async () => {
    if (!shortUrl) return;
    await navigator.clipboard.writeText(shortUrl);
    showToast('Copied to clipboard');
  }, [shortUrl]);

  const shortenUrlFn = useCallback(async (url: string) => {
    if (shareUrlCache.has(url)) {
      const shortenedUrl = shareUrlCache.get(url) || '';
      setShortUrl(shortenedUrl);
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
      showToast(`Couldn't shorten url`, 'negative');
      setShortUrl('');
      setLoading(false);
      return;
    }

    const shortenedUrl = data?.shortenedUrl || '';
    shareUrlCache.set(url, shortenedUrl);
    setShortUrl(shortenedUrl);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isDropdownVisible) {
      const longUrl = window.location.href;
      shortenUrlFn(longUrl);
    }
  }, [isDropdownVisible, shortenUrlFn]);

  // Prevent aligned mobile dropdown from going offscreen
  useEffect(() => {
    if (!dropdownRef.current || !isMobile) {
      return;
    }
    const rect = dropdownRef.current.getBoundingClientRect();
    const rightEndOverflow = rect.right - window.outerWidth;
    const leftEndOverflow = -rect.left;
    if (dropdownAlignment === 'left' && rightEndOverflow > 0) {
      const left = -rightEndOverflow - 15;
      dropdownRef.current.style.left = `${left}px`;
    } else if (dropdownAlignment === 'right' && leftEndOverflow > 0) {
      const right = -leftEndOverflow - 8;
      dropdownRef.current.style.right = `${right}px`;
    } else if (dropdownAlignment === 'center' && rightEndOverflow > 0) {
      const left = -rightEndOverflow + 15;
      dropdownRef.current.style.left = `${left}px`;
    } else if (dropdownAlignment === 'center' && leftEndOverflow > 0) {
      const left = leftEndOverflow + 8;
      dropdownRef.current.style.left = `calc(50% + ${left}px)`;
    }
  }, [dropdownAlignment, isMobile]);

  return (
    <>
      <div
        className="text-xs font-medium relative flex flex-col items-end"
        ref={containerRef}
      >
        <Tooltip
          content="Get short URL for this view"
          contentClassName={tooltipClass}
          disabled={isDropdownVisible}
        >
          <button
            className={classNames(
              'py-1.5 px-3 text-text-button button-filter rounded-full flex-row-center border border-solid border-transparent',
              {
                'border-white': isDropdownVisible
              }
            )}
            onClick={handleDropdownToggle}
          >
            <ShareIcon />
          </button>
        </Tooltip>
        {isDropdownVisible && (
          <div
            ref={dropdownRef}
            className={classNames(
              'bg-glass border-solid-stroke rounded-18 p-3.5 mt-1 absolute max-sm:w-[288px] w-[360px] top-9 z-20',
              {
                'left-0': dropdownAlignment === 'left',
                'left-1/2 -translate-x-1/2': dropdownAlignment === 'center',
                'right-0': dropdownAlignment === 'right'
              }
            )}
          >
            <div className="text-xs font-bold text-white">
              Share this view with others
            </div>
            <div className="flex-row-center mt-2.5 gap-3 h-[35px]">
              {loading ? (
                <Image src="images/loader.svg" height={20} width={30} />
              ) : (
                <>
                  <div className="rounded-18 bg-glass-2 text-xs text-text-secondary h-[35px] px-3 flex items-center overflow-auto no-scrollbar w-full">
                    {shortUrl}
                  </div>
                  <button
                    type="button"
                    className="rounded-18 button-primary hover:opacity-70 transition-opacity active:opacity-50 flex-row-center gap-1 px-4 h-[35px]"
                    onClick={handleCopyClick}
                  >
                    <span className="max-sm:hidden">
                      <Icon
                        name="copy-white"
                        className="max-w-[16px]"
                        height="16"
                        width="16"
                      />
                    </span>
                    Copy
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
