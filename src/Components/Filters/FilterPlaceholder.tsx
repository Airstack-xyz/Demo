/* eslint-disable react-refresh/only-export-components */
import classNames from 'classnames';
import { Icon, IconType } from '../Icon';

export const filterPlaceholderClass =
  'py-1.5 px-3 mr-3.5 rounded-full bg-glass-1 text-text-secondary border border-solid border-transparent text-xs enabled:hover:bg-glass-1-light disabled:hover:bg-glass-1 disabled:hover:cursor-not-allowed disabled:opacity-60 flex justify-center items-center';

type FilterPlaceholderProps = {
  isOpen?: boolean;
  isDisabled?: boolean;
  icon?: IconType;
  label: string;
  onClick?: () => void;
};

export function FilterPlaceholder({
  isOpen,
  isDisabled,
  icon,
  label,
  onClick
}: FilterPlaceholderProps) {
  return (
    <button
      disabled={isDisabled}
      className={classNames(filterPlaceholderClass, { 'border-white': isOpen })}
      onClick={onClick}
    >
      {icon && <Icon name={icon} height={12} width={12} className="mr-1.5" />}
      {label}
    </button>
  );
}
