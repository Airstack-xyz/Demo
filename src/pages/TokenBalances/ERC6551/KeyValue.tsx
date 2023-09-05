import { ReactNode } from 'react';

export function KeyValue({ name, value }: { name: string; value: ReactNode }) {
  return (
    <div className="flex overflow-hidden ellipsis mt-3">
      <div className="w-[140px]">{name}</div>
      <div className="text-text-secondary flex flex-1 ellipsis">{value}</div>
    </div>
  );
}
