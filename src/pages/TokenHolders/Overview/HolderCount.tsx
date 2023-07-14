import { ReactNode } from 'react';

export function HolderCount({
  count,
  subText,
  image
}: {
  count: number;
  subText: string;
  image?: ReactNode;
}) {
  return (
    <div
      className="px-3 py-5 flex items-center rounded-xl bg-tertiary"
      data-loader-type="block"
      data-loader-height="auto"
    >
      <div className="rounded-full w-[47px] h-[47px] overflow-hidden flex-row-center">
        {image}
      </div>
      <div className="pl-2.5">
        <div className="text-xl font-bold">{count}</div>
        <div className="text-text-secondary text-xs">{subText}</div>
      </div>
    </div>
  );
}
