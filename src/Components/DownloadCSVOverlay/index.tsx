import classNames from 'classnames';
import { useState } from 'react';
import classnames from 'classnames';
import { useTokenBalancesLinks } from './useTokenBalancesLinks';
import { useTokenHoldersLinks } from './useTokenHoldersLinks';
import { useMatch } from 'react-router-dom';

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M11 8L8 11M8 11L5 8M8 11V2M14.75 11V12.5C14.75 13.3284 14.0785 14 13.25 14H2.75C1.92157 14 1.25 13.3284 1.25 12.5V11"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M9.79132 2.99063C9.87524 2.57136 9.60334 2.1635 9.18404 2.07964C8.76474 1.99579 8.3569 2.26769 8.27308 2.68696L9.79132 2.99063ZM6.20858 13.0095C6.12466 13.4288 6.39655 13.8366 6.81585 13.9204C7.23515 14.0043 7.64299 13.7325 7.72681 13.3131L6.20858 13.0095ZM3.32738 11.6048C3.63184 11.905 4.12202 11.9014 4.42223 11.597C4.72242 11.2925 4.71897 10.8024 4.4145 10.5021L3.32738 11.6048ZM0.774188 8.00005L0.230626 7.44872C0.0830757 7.59427 0 7.79288 0 8.00005C0 8.20722 0.0830757 8.40583 0.230626 8.55137L0.774188 8.00005ZM4.4145 5.49794C4.71897 5.19773 4.72242 4.70755 4.42223 4.40309C4.12202 4.09863 3.63184 4.09517 3.32738 4.39537L4.4145 5.49794ZM11.5894 10.4549C11.2827 10.753 11.2758 11.2431 11.5738 11.5497C11.8718 11.8563 12.3619 11.8632 12.6685 11.5652L11.5894 10.4549ZM15.2257 8.00005L15.7653 8.55519C15.9139 8.41078 15.9984 8.2128 15.9999 8.00552C16.0013 7.79835 15.9197 7.59912 15.7731 7.45265L15.2257 8.00005ZM12.6764 4.35586C12.374 4.05353 11.8839 4.05353 11.5815 4.35586C11.2792 4.6582 11.2792 5.14839 11.5815 5.45073L12.6764 4.35586ZM8.27308 2.68696L6.20858 13.0095L7.72681 13.3131L9.79132 2.99063L8.27308 2.68696ZM4.4145 10.5021L1.31775 7.44872L0.230626 8.55137L3.32738 11.6048L4.4145 10.5021ZM1.31775 8.55137L4.4145 5.49794L3.32738 4.39537L0.230626 7.44872L1.31775 8.55137ZM12.6685 11.5652L15.7653 8.55519L14.6861 7.44491L11.5894 10.4549L12.6685 11.5652ZM15.7731 7.45265L12.6764 4.35586L11.5815 5.45073L14.6783 8.54745L15.7731 7.45265Z"
        fill="white"
      />
    </svg>
  );
}

export function DownloadCSVOverlay({ className }: { className?: string }) {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const isTokenBalancesPage = !!useMatch('/token-balances');
  const getTokenBalanceLink = useTokenBalancesLinks();
  const getTokenHoldersLink = useTokenHoldersLinks();
  const apiLink = isTokenBalancesPage
    ? getTokenBalanceLink()
    : getTokenHoldersLink();

  return (
    <div
      className={classnames(
        'flex-col-center h-80 absolute w-full bottom-0 z-20 text-sm px-5 rounded-b-2xl bg-glass-2',
        className
      )}
    >
      {showComingSoon && (
        <div>
          <div className="bg-[#C28120] rounded-lg px-2.5 py-1 mb-5">
            coming soon!
          </div>
        </div>
      )}
      <div
        className={classNames('font-semibold mb-8 text-center', {
          'text-xl': showComingSoon,
          'text-lg': !showComingSoon
        })}
      >
        {showComingSoon
          ? 'CSV downloads are coming soon. In meantime you can get API.'
          : 'Download CSV or Get API to view the entire results'}
      </div>
      <div className="flex-row-center">
        {!showComingSoon && (
          <button
            id="download-csv"
            className="bg-text-button hover:opacity-90 text-white rounded-18 font-medium px-5 py-1.5 mr-5 flex-row-center"
            onClick={() => {
              setShowComingSoon(true);
            }}
          >
            <span className="mr-1.5">
              <DownloadIcon />
            </span>
            Download CSV
          </button>
        )}
        <a
          className="bg-text-button hover:opacity-90 text-white rounded-18 font-medium px-5 py-1.5 flex-row-center"
          href={apiLink}
          target="_blank"
          id={
            showComingSoon
              ? 'get-api-csv-download-coming-soon'
              : 'get-api-csv-download'
          }
        >
          <span className="mr-1.5">
            <CodeIcon />
          </span>
          Get API
        </a>
      </div>
    </div>
  );
}
