import { Icon } from './Icon';
import { showToast } from '../utils/showToast';
import classNames from 'classnames';

export function WalletAddress({
  address,
  dataType,
  className,
  onClick
}: {
  address: string;
  dataType?: string;
  className?: string;
  onClick?: (address: string, dataType?: string) => void;
}) {
  const handleClick = () => {
    onClick?.(address, dataType);
  };

  const handleCopy = async (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    event.stopPropagation();
    await navigator.clipboard.writeText(address);
    showToast('Copied to clipboard');
  };

  return (
    <div
      className={classNames(
        'flex px-1 py-1 rounded-18 hover:bg-hover-primary cursor-pointer',
        className
      )}
      onClick={handleClick}
    >
      <span className="ellipsis">{address || '--'}</span>
      {address && (
        <Icon
          name="copy"
          className="ml-1"
          height={16}
          width={16}
          onClick={handleCopy}
        />
      )}
    </div>
  );
}
