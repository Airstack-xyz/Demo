import classNames from 'classnames';

type LoaderProps = {
  total: number;
  matching: number;
  spam?: number;
  totalSuffix?: string;
  spamSuffix?: string;
  matchingSuffix?: string;
};

export function StatusLoader({
  total,
  matching,
  spam,
  totalSuffix = 'records',
  spamSuffix = 'tokens',
  matchingSuffix = 'records'
}: LoaderProps) {
  const renderRow = (prefix: string, count: number, suffix: string) => {
    return (
      <div
        className={classNames('flex items-center ellipsis py-1', {
          'text-text-secondary': !count
        })}
      >
        <img src="images/loader.svg" height={20} width={30} className="mr-2" />
        <span className="ellipsis">
          {prefix} {count} {suffix}
        </span>
      </div>
    );
  };
  return (
    <div className="fixed inset-5 sm:inset-10 flex justify-center items-end pointer-events-none z-[25]">
      <div className="bg-glass rounded-18 p-8 border-solid-stroke max-w-[90%] sm:max-w-[500px]">
        {renderRow('Scanning', total, totalSuffix)}
        {spam === undefined ? null : renderRow('Filtered', spam, spamSuffix)}
        {renderRow('Found', matching, matchingSuffix)}
      </div>
    </div>
  );
}
