import { Icon } from '../../../Components/Icon';
import { showToast } from '../../../utils/showToast';

export function WalletAddress({
  address,
  onClick
}: {
  address: string;
  onClick: (address: string) => void;
}) {
  return (
    <div
      className="flex px-1 py-1 rounded-18 hover:bg-glass-1 cursor-pointer"
      onClick={() => {
        onClick(address);
      }}
    >
      <span className="ellipsis">{address || '--'}</span>
      {address && (
        <Icon
          name="copy"
          height={16}
          width={16}
          onClick={async e => {
            e.stopPropagation();
            await navigator.clipboard.writeText(address);
            showToast('Copied to clipboard');
          }}
        />
      )}
    </div>
  );
}
