import { showToast } from '../utils/showToast';
import { Icon } from './Icon';

export function CopyButton({ value }: { value: string }) {
  return (
    <button
      className="p-0 w-5"
      onClick={async e => {
        e.stopPropagation();
        await navigator.clipboard.writeText(value);
        showToast('Copied to clipboard');
      }}
    >
      <Icon name="copy" height={16} width={16} />
    </button>
  );
}
