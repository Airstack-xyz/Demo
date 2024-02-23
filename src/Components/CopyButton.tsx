import classNames from 'classnames';
import { showToast } from '../utils/showToast';
import { Icon } from './Icon';

export function CopyButton({ value }: { value: string }) {
  return (
    <button
      className="p-0 w-5"
      onClick={async e => {
        e.stopPropagation();
        if (!value) return;
        await navigator.clipboard.writeText(value);
        showToast('Copied to clipboard');
      }}
    >
      <Icon name="copy" height={16} width={16} />
    </button>
  );
}

export function RoundedCopyButton({
  value,
  className
}: {
  value: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={classNames(
        'rounded-18 bg-button-primary hover:opacity-70 transition-opacity active:opacity-50 flex-row-center px-4 h-[35px] text-xs text-white font-semibold',
        className
      )}
      onClick={async e => {
        e.stopPropagation();
        if (!value) return;
        await navigator.clipboard.writeText(value);
        showToast('Copied to clipboard');
      }}
    >
      <Icon name="copy-white" height={16} width={16} />
      <span className="ml-1">Copy</span>
    </button>
  );
}
