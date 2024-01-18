/* eslint-disable react-refresh/only-export-components */
import classNames from 'classnames';
import { Icon, IconType } from '../Icon';

export const filterPlaceholderClass =
  'py-1.5 px-3 min-h-[30px] rounded-full bg-glass-1 text-text-secondary border border-solid border-transparent text-xs enabled:hover:bg-glass-1-light disabled:hover:bg-glass-1 disabled:opacity-50 disabled:cursor-not-allowed flex-row-center';

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
