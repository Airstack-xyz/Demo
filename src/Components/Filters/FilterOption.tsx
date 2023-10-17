import classNames from 'classnames';
import { Icon } from '../Icon';

const filterOptionClass =
  'flex items-center py-1 px-2 rounded-full mb-1 text-left whitespace-nowrap disabled:hover:cursor-not-allowed disabled:opacity-50';

type FilterOptionProps = {
  onClick?: () => void;
  isDisabled?: boolean;
  isSelected?: boolean;
  className?: string;
  label: string;
  tabIndex?: number;
};

export function FilterOption({
  onClick,
  isDisabled,
  isSelected,
  className,
  label,
  tabIndex
}: FilterOptionProps) {
  return (
    <button
      tabIndex={tabIndex}
      disabled={isDisabled}
      className={classNames(
        filterOptionClass,
        {
          'font-bold': isSelected
        },
        className
      )}
      onClick={onClick}
    >
      <Icon
        name="check-mark"
        width={8}
        height={8}
        className={classNames('mx-2', {
          invisible: !isSelected
        })}
      />
      {label}
    </button>
  );
}
