import { ReactNode } from 'react';

export function KeyValue({ name, value }: { name: string; value: ReactNode }) {
  return (
    <div className="flex mt-3 flex-col md:flex-row">
      <div className="w-full sm:w-[140px]">{name}</div>
      <div className="text-text-secondary flex-1 ellipsis flex">{value}</div>
    </div>
  );
}
