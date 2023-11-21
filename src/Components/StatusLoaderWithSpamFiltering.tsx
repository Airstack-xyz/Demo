import classNames from 'classnames';

type LoaderProps = {
  total: number;
  spam: number;
  matching: number;
  totalCountSuffix?: string;
  spamCountSuffix?: string;
  matchingCountSuffix?: string;
};

export function StatusLoaderWithSpamFiltering({
  total,
  spam,
  matching,
  totalCountSuffix = 'records',
  spamCountSuffix = 'tokens',
  matchingCountSuffix = 'records'
}: LoaderProps) {
  const renderRow = (prefix: string, count: number, suffix: string) => {
    return (
      <div
        className={classNames('flex items-center ellipsis', {
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
      <div className="bg-glass rounded-18 p-9 border-solid-stroke max-w-[90%] sm:max-w-[500px]">
        {renderRow('Scanning', total, totalCountSuffix)}
        {renderRow('Filtered', spam, spamCountSuffix)}
        {renderRow('Found', matching, matchingCountSuffix)}
      </div>
    </div>
  );
}
