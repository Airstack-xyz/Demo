import classNames from 'classnames';
import { Icon } from '../Icon';

const filterOptionClass =
  'mb-1 flex w-full items-center whitespace-nowrap rounded-full px-2 py-1 text-left disabled:opacity-50 disabled:hover:cursor-not-allowed';

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
