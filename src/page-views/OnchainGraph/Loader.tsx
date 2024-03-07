import { useOutsideClick } from '../../hooks/useOutsideClick';
import { useOnchainGraphContext } from './hooks/useOnchainGraphContext';
import { Image } from '@/Components/Image';

type LoaderProps = {
  total: number;
  matching: number;
  scanCompleted?: boolean;
  onSortByScore?: () => void;
  onCloseLoader: () => void;
  onCancelScan?: () => void;
  onRestartScan: () => void;
};
function Loading() {
  return (
    <Image src="images/loader.svg" height={20} width={30} className="mr-2" />
  );
}

function LoadingCompleted() {
  return (
    <Image
      src="images/loader-completed.svg"
      height={18}
      width={18}
      className="mr-2"
    />
  );
}

function ErrorIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
    >
      <g clipPath="url(#clip0_2342_116843)">
        <path
          d="M9 18C4.02923 18 0 13.9708 0 9C0 4.02923 4.02923 0 9 0C13.9708 0 18 4.02923 18 9C18 13.9708 13.9708 18 9 18ZM13.1268 6.37546C13.2958 6.20654 13.2958 5.93169 13.1268 5.76277L12.2075 4.84408C12.0385 4.67515 11.7637 4.67515 11.5948 4.84408L8.991 7.44785L6.38723 4.84408C6.21831 4.67515 5.94346 4.67515 5.77454 4.84408L4.85515 5.76277C4.68623 5.93169 4.68623 6.20654 4.85515 6.37546L7.45962 8.97992L4.85515 11.583C4.68623 11.7519 4.68623 12.0268 4.85515 12.1957L5.77454 13.1151C5.94346 13.284 6.21831 13.284 6.38723 13.1151L8.991 10.5106L11.5948 13.1151C11.7637 13.284 12.0385 13.284 12.2075 13.1151L13.1268 12.1957C13.2958 12.0268 13.2958 11.7519 13.1268 11.583L10.5224 8.97992L13.1268 6.37546Z"
          fill="#F30C0C"
        />
      </g>
      <defs>
        <clipPath id="clip0_2342_116843">
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

const TextWithLoader = ({
  text,
  loading
}: {
  text: string;
  loading: boolean;
}) => {
  return (
    <div className="flex items-center mb-3">
      {loading ? <Loading /> : <LoadingCompleted />}
      <span className="ellipsis">{text}</span>
    </div>
  );
};

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
  >
    <circle cx="11" cy="11" r="11" fill="#8B8EA0" />
    <path
      d="M7 7L15 15"
      stroke="#0E0E12"
      strokeWidth="0.888889"
      strokeLinecap="round"
    />
    <path
      d="M7 15L15 7"
      stroke="#0E0E12"
      strokeWidth="0.888889"
      strokeLinecap="round"
    />
  </svg>
);

export function Loader({
  total,
  matching,
  scanCompleted,
  onCloseLoader,
  onCancelScan,
  onRestartScan
}: LoaderProps) {
  const { scanIncomplete, reset, setScanIncomplete } = useOnchainGraphContext();
  const containerRef = useOutsideClick<HTMLDivElement>(() => {
    if (scanCompleted || scanIncomplete) {
      onCloseLoader();
    }
  });

  return (
    <div className="fixed h-0 left-0 right-0 bottom-10  flex justify-center items-end z-[25]">
      <div
        ref={containerRef}
        className="bg-glass rounded-18 p-6 border-solid-stroke max-w-[90%] sm:max-w-[500px] relative"
      >
        {(scanIncomplete || scanCompleted) && (
          <button
            className="absolute -right-2 -top-2 rounded-full cursor-pointer"
            onClick={() => onCloseLoader?.()}
          >
            <CloseIcon />
          </button>
        )}
        <TextWithLoader
          loading={scanCompleted ? false : !scanCompleted}
          text={
            scanCompleted
              ? `Scanned ${total} records`
              : `Scanning ${total} onchain records`
          }
        />

        <TextWithLoader
          loading={scanCompleted ? false : !scanCompleted}
          text={
            scanCompleted
              ? `Found ${matching} onchain connections`
              : `Analyzing ${total} onchain interactions`
          }
        />

        {!scanIncomplete && (
          <TextWithLoader
            loading={scanCompleted ? false : !scanCompleted}
            text={
              scanCompleted ? 'Scan complete' : 'Scoring onchain connections'
            }
          />
        )}

        {scanIncomplete && (
          <div className="flex items-center mb-3">
            <ErrorIcon />
            <span className="ellipsis ml-1.5">Scan incomplete</span>
          </div>
        )}

        <div className="flex items-center ellipsis">
          {scanIncomplete && (
            <button
              className="text-text-button font-medium"
              onClick={() => {
                reset();
                onRestartScan();
              }}
            >
              Restart scan
            </button>
          )}

          {!scanIncomplete && !scanCompleted && (
            <button
              onClick={() => {
                onCancelScan?.();
                setScanIncomplete(true);
              }}
              className="text-text-button font-medium"
            >
              Stop scanning
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
