import { ReactNode } from 'react';
import { Icon } from '../../../Components/Icon';

export function HolderCount({
  count,
  subText,
  image,
  loading
}: {
  count: number;
  subText: string;
  image?: ReactNode;
  loading: boolean;
}) {
  return (
    <div
      className="px-3 py-5 flex items-center rounded-18 bg-glass"
      data-loader-type="block"
      data-loader-height="auto"
    >
      <div className="rounded-full  min-w-[47px] w-[47px] h-[47px] overflow-hidden flex-row-center">
        {image}
      </div>
      <div className="pl-2.5">
        <div className="text-xl font-bold">
          {loading ? (
            <div className="h-6 flex items-center">
              <Icon name="count-loader" className="h-2.5 w-auto" />
            </div>
          ) : (
            count
          )}
        </div>
        <div className="text-text-secondary text-xs">{subText}</div>
      </div>
    </div>
  );
}
