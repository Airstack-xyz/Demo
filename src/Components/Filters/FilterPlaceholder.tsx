import classNames from 'classnames';
import { Icon, IconType } from '../Icon';

export const filterPlaceholderClass =
  'bg-glass-1 text-text-secondary enabled:hover:bg-glass-1-light disabled:hover:bg-glass-1 flex-row-center min-h-[30px] rounded-full border border-solid border-transparent px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-50';

type FilterPlaceholderProps = {
  isOpen?: boolean;
  isDisabled?: boolean;
  icon?: IconType;
  iconSize?: number;
  label?: string;
  className?: string;
  tabIndex?: number;
  onClick?: () => void;
};

export function FilterPlaceholder({
  isOpen,
  isDisabled,
  icon,
  iconSize = 12,
  label,
  className,
  tabIndex,
  onClick
}: FilterPlaceholderProps) {
  return (
    <button
      tabIndex={tabIndex}
      disabled={isDisabled}
      className={classNames(
        filterPlaceholderClass,
        isOpen ? 'border-white' : '',
        className
      )}
      onClick={onClick}
    >
      {icon && (
        <Icon
          name={icon}
          height={iconSize}
          width={iconSize}
          className={classNames(label ? 'mr-1.5' : '')}
        />
      )}
      {label}
    </button>
  );
}
