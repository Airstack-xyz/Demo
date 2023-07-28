import classNames from 'classnames';
import { useSearchInput } from '../../../../hooks/useSearchInput';

type LoaderProps = {
  total: number;
  matching: number;
};

export function StatusLoader({ total, matching }: LoaderProps) {
  const [{ activeViewToken }] = useSearchInput();
  return (
    <div className="fixed inset-10 flex justify-center items-end pointer-events-none">
      <div className="bg-glass rounded-18 p-9 border-solid-stroke">
        <div className="mb-4">
          Scanning {total} {activeViewToken}..
        </div>
        <div
          className={classNames({
            'text-text-secondry': !matching
          })}
        >
          {matching ? 'Found' : 'Find'} {matching} matching results
        </div>
      </div>
    </div>
  );
}
