import classNames from 'classnames';
import { Image } from '@/Components/Image';

type LoaderProps = {
  lines: [string, number][];
};

export function StatusLoader({ lines }: LoaderProps) {
  const renderRow = (line: string, count: number) => {
    return (
      <div
        key={line}
        className={classNames('flex items-center ellipsis py-1', {
          'text-text-secondary': !count
        })}
      >
        <Image
          src="images/loader.svg"
          height={20}
          width={30}
          className="mr-2"
        />
        <span className="ellipsis">{line.replace('%n', count.toString())}</span>
      </div>
    );
  };
  return (
    <div className="fixed inset-5 sm:inset-10 flex justify-center items-end pointer-events-none z-[25]">
      <div className="card rounded-18 p-8 max-w-[90%] sm:max-w-[500px]">
        {lines.map(([line, count]) => renderRow(line, count))}
      </div>
    </div>
  );
}
