import classNames from 'classnames';
import { useMemo } from 'react';

type LoaderProps = {
  total: number;
  matching: number;
  tokenName?: string;
};

export function StatusLoader({
  total,
  matching,
  tokenName = 'records'
}: LoaderProps) {
  const loader = useMemo(() => {
    return (
      <img src="images/loader.svg" height={20} width={30} className="mr-2" />
    );
  }, []);
  return (
    <div className="fixed inset-5 sm:inset-10 flex justify-center items-end pointer-events-none z-[25]">
      <div className="bg-glass rounded-18 p-9 border-solid-stroke max-w-[90%] sm:max-w-[500px]">
        <div className="mb-4 flex items-center">
          {loader}
          <span className="ellipsis">
            Scanning {total} {tokenName}
          </span>
        </div>
        <div
          className={classNames('flex ellipsis', {
            'text-text-secondry': !matching
          })}
        >
          {loader} {matching ? 'Found' : 'Find'} {matching} matching results
        </div>
      </div>
    </div>
  );
}
