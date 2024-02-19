import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { useOutsideClick } from '../hooks/useOutsideClick';
import { shortenUrl } from '../hooks/useShortenURL';
import { showToast } from '../utils/showToast';

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
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 5L8 2M8 2L5 5M8 2V11M14.75 11V12.5C14.75 13.3284 14.0785 14 13.25 14H2.75C1.92157 14 1.25 13.3284 1.25 12.5V11"
        stroke="#65AAD0"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ShareURLDropdown({
  dropdownAlignment = 'left'
}: {
  dropdownAlignment?: string;
}) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
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
    if (isDropdownVisible && shortUrl === null) {
      const longUrl = window.location.href;
      shortenUrl(longUrl).then(({ data, error }) => {
        if (error) {
          showToast(`Couldn't shorten url`, 'negative');
        }
        setShortUrl(data?.shortenedUrl || '');
      });
    }
  }, [isDropdownVisible, shortUrl]);

  return (
    <>
      <div
        className="text-xs font-medium relative flex flex-col items-end"
        ref={containerRef}
      >
        <button
          title="Get short URL for this view"
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
        {isDropdownVisible && (
          <div
            className={classNames(
              'bg-glass border-solid-stroke rounded-18 p-3.5 mt-1 absolute w-[334px] top-9 z-20',
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
              {shortUrl === null ? (
                <img src="images/loader.svg" height={20} width={30} />
              ) : (
                <>
                  <div className="rounded-18 bg-glass-2 text-xs text-text-secondary h-[35px] px-3 flex items-center overflow-auto no-scrollbar w-full">
                    {shortUrl}
                  </div>
                  <button
                    type="button"
                    className="rounded-18 bg-button-primary hover:opacity-70 transition-opacity active:opacity-50 flex-row-center px-4 h-[35px]"
                    onClick={handleCopyClick}
                  >
                    <CopyIconWhite />
                    <span className="ml-1">Copy</span>
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
