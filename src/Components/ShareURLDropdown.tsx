import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { useOutsideClick } from '../hooks/useOutsideClick';
import { shortenUrl } from '../hooks/useShortenURL';
import { showToast } from '../utils/showToast';
import { Tooltip, tooltipClass } from './Tooltip';

function CopyIconWhite() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
    >
      <g clipPath="url(#clip0_3274_11194)">
        <mask
          id="mask0_3274_11194"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="14"
          height="14"
        >
          <path d="M14 0H0V14H14V0Z" fill="white" />
        </mask>
        <g mask="url(#mask0_3274_11194)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.25 7.875V2.625C12.25 2.14375 11.8562 1.75 11.375 1.75H6.125C5.64375 1.75 5.25 2.14375 5.25 2.625V7.875C5.25 8.35625 5.64375 8.75 6.125 8.75H11.375C11.8562 8.75 12.25 8.35625 12.25 7.875ZM11.375 7.875H6.125V2.625H11.375V7.875ZM5.6875 9.625C4.97 9.625 4.375 9.03875 4.375 8.3125V5.25H2.625C2.14375 5.25 1.75 5.64375 1.75 6.125V11.375C1.75 11.8562 2.14375 12.25 2.625 12.25H7.875C8.35625 12.25 8.75 11.8562 8.75 11.375V9.625H5.6875Z"
            fill="white"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_3274_11194">
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function ShareIconBlue() {
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
        fill-rule="evenodd"
        d="M11.7692 13.9231c-.8922 0-1.6154-.7232-1.6154-1.6154s.7232-1.6154 1.6154-1.6154c.8923 0 1.6154.7232 1.6154 1.6154s-.7231 1.6154-1.6154 1.6154ZM4.2308 9.6154c-.8923 0-1.6154-.7232-1.6154-1.6154 0-.8917.7231-1.6154 1.6154-1.6154.8922 0 1.6153.7237 1.6153 1.6154 0 .8922-.7231 1.6154-1.6153 1.6154Zm7.5384-7.5385c.8923 0 1.6154.7232 1.6154 1.6154s-.7231 1.6154-1.6154 1.6154c-.8922 0-1.6154-.7232-1.6154-1.6154s.7232-1.6154 1.6154-1.6154Zm0 7.5385c-.9531 0-1.785.4981-2.2637 1.2449L6.6221 9.2126c.1863-.3661.301-.7743.301-1.2126 0-.2709-.0523-.5272-.1266-.7738l2.9998-1.7139c.4916.533 1.1905.8723 1.9729.8723 1.4873 0 2.6923-1.205 2.6923-2.6923C14.4615 2.2051 13.2565 1 11.7692 1 10.282 1 9.0769 2.205 9.0769 3.6923c0 .2709.0522.5272.1265.7743L6.2037 6.18c-.4916-.5325-1.1906-.8723-1.973-.8723-1.4872 0-2.6922 1.205-2.6922 2.6923 0 1.4872 1.205 2.6923 2.6923 2.6923.6138 0 1.1733-.2132 1.6261-.5589l-.0108.0204 3.2604 1.8631c-.0107.097-.0296.1906-.0296.2908C9.077 13.7949 10.282 15 11.7692 15c1.4873 0 2.6923-1.2051 2.6923-2.6923 0-1.4872-1.205-2.6923-2.6923-2.6923Z"
        clip-rule="evenodd"
      />
    </svg>
  );
}

const shareUrlCache = new Map<string, string>();

export function ShareURLDropdown({
  dropdownAlignment = 'left'
}: {
  dropdownAlignment?: string;
}) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState<string | null>(null);

  const handleDropdownClose = useCallback(() => {
    setIsDropdownVisible(false);
  }, []);

  const containerRef = useOutsideClick<HTMLDivElement>(handleDropdownClose);

  const handleDropdownToggle = useCallback(() => {
    setIsDropdownVisible(prevValue => !prevValue);
  }, []);

  const handleCopyClick = useCallback(async () => {
    if (!shortUrl) return;
    await navigator.clipboard.writeText(shortUrl);
    showToast('Copied to clipboard');
  }, [shortUrl]);

  useEffect(() => {
    if (isDropdownVisible) {
      const longUrl = window.location.href;
      if (shareUrlCache.has(longUrl)) {
        const shortenedUrl = shareUrlCache.get(longUrl) || '';
        setShortUrl(shortenedUrl);
        return;
      }
      setLoading(true);
      shortenUrl(longUrl)
        .then(({ data, error }) => {
          if (error) {
            showToast(`Couldn't shorten url`, 'negative');
            setShortUrl('');
            return;
          }
          const shortenedUrl = data?.shortenedUrl || '';
          shareUrlCache.set(longUrl, shortenedUrl);
          setShortUrl(shortenedUrl);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isDropdownVisible]);

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
              'py-1.5 px-3 text-text-button bg-glass-1 rounded-full flex-row-center border border-solid border-transparent',
              {
                'border-white': isDropdownVisible
              }
            )}
            onClick={handleDropdownToggle}
          >
            <ShareIconBlue />
          </button>
        </Tooltip>
        {isDropdownVisible && (
          <div
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
                <img src="images/loader.svg" height={20} width={30} />
              ) : (
                <>
                  <div className="rounded-18 bg-glass-2 text-xs text-text-secondary h-[35px] px-3 flex items-center overflow-auto no-scrollbar w-full">
                    {shortUrl}
                  </div>
                  <button
                    type="button"
                    className="rounded-18 bg-button-primary hover:opacity-70 transition-opacity active:opacity-50 flex-row-center gap-1 px-4 h-[35px]"
                    onClick={handleCopyClick}
                  >
                    <span className="max-sm:hidden">
                      <CopyIconWhite />
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
