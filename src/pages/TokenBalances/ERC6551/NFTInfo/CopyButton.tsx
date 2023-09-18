import { CopyButton as CopyBtn } from '../../../../Components/CopyButton';

export function CopyButton({ value }: { value: string }) {
  return (
    <span className="ml-0.5">
      <CopyBtn value={value} />
    </span>
  );
}
