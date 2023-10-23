import classNames from 'classnames';

type LoaderProps = {
  total: number;
  matching: number;
  tokenName?: string;
  scanCompleted?: boolean;
  onSortByScore?: () => void;
  onCloseLoader: () => void;
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

export function Loader({
  total,
  matching,
  tokenName = 'records',
  scanCompleted,
  onSortByScore,
  onCloseLoader
}: LoaderProps) {
  return (
    <div
      className="fixed left-0 right-0 bottom-10  flex justify-center items-end z-[25]"
      onClick={() => !matching && onCloseLoader?.()}
    >
      <div className="bg-glass rounded-18 p-9 border-solid-stroke max-w-[90%] sm:max-w-[500px]">
        <div className="flex items-center">
          {scanCompleted ? <LoadingCompleted /> : <Loading />}
          <span className="ellipsis">
            Scanning {total} {tokenName}
          </span>
        </div>
        <div
          className={classNames('flex items-center ellipsis my-4', {
            'text-text-secondary': !matching
          })}
        >
          {scanCompleted ? <LoadingCompleted /> : <Loading />}
          <span>
            {matching ? 'Found' : 'Find'} {matching} matching results
          </span>
        </div>
        <div
          className={classNames('flex items-center ellipsis', {
            'text-text-secondary': !matching
          })}
        >
          {scanCompleted ? (
            <LoadingCompleted />
          ) : (
            <span className="grayscale">
              <Loading />
            </span>
          )}
          {scanCompleted ? (
            <span>
              Scan complete{' '}
              <button
                className="bg-white rounded-18 text-primary px-2.5 py-1 font-medium ml-5"
                onClick={() => {
                  onSortByScore?.();
                }}
              >
                Sort by score
              </button>
            </span>
          ) : (
            <span>Waiting for scanning to complete to sort based on score</span>
          )}
        </div>
      </div>
    </div>
  );
}
