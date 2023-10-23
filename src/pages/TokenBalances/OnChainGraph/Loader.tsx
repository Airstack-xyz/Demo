type LoaderProps = {
  total: number;
  matching: number;
  scanCompleted?: boolean;
  onSortByScore?: () => void;
  onCloseLoader: () => void;
  onCancelScan?: () => void;
};
function Loading() {
  return (
    <img src="images/loader.svg" height={20} width={30} className="mr-2" />
  );
}

function LoadingCompleted() {
  return (
    <img
      src="images/loader-completed.svg"
      height={18}
      width={18}
      className="mr-2"
    />
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

export function Loader({
  total,
  matching,
  scanCompleted,
  onSortByScore,
  onCloseLoader,
  onCancelScan
}: LoaderProps) {
  return (
    <div
      className="fixed left-0 right-0 bottom-10  flex justify-center items-end z-[25]"
      onClick={() => !matching && onCloseLoader?.()}
    >
      <div className="bg-glass rounded-18 p-6 border-solid-stroke max-w-[90%] sm:max-w-[500px]">
        <TextWithLoader
          loading={!scanCompleted}
          text={
            scanCompleted
              ? `Scanned ${total} records`
              : `Scanning ${total} onchain records`
          }
        />

        <TextWithLoader
          loading={!scanCompleted}
          text={
            scanCompleted
              ? `Found ${matching} onchain connections`
              : `Analyzing ${total} onchain interactions`
          }
        />

        <TextWithLoader
          loading={!scanCompleted}
          text={scanCompleted ? 'Scan complete' : 'Scoring onchain connections'}
        />

        <div className="flex items-center ellipsis">
          {scanCompleted ? (
            <button
              className="bg-white rounded-18 text-primary px-2.5 py-1 font-medium mt-1 text-xs"
              onClick={() => {
                onSortByScore?.();
              }}
            >
              Sort by score
            </button>
          ) : (
            <button
              onClick={() => onCancelScan?.()}
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
