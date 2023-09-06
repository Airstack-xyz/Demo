import classNames from 'classnames';
import { Icon } from '../Icon';

const filterOptionClass =
  'flex items-center py-1 px-2 rounded-full mb-1 text-left whitespace-nowrap disabled:hover:cursor-not-allowed disabled:opacity-50';

type FilterOptionProps = {
  onClick: () => void;
  isDisabled?: boolean;
  isSelected?: boolean;
  label: string;
};

export function FilterOption({
  onClick,
  isDisabled,
  isSelected,
  label
}: FilterOptionProps) {
  return (
    <button
      disabled={isDisabled}
      className={classNames(filterOptionClass, {
        'font-bold': isSelected
      })}
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
