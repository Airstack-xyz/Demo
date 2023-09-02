import classNames from 'classnames';
import { Icon } from '../Icon';

type FilterOptionProps = {
  onClick: () => void;
  isSelected?: boolean;
  label: string;
};

export function FilterOption({
  onClick,
  isSelected,
  label
}: FilterOptionProps) {
  return (
    <label
      className={classNames(
        'flex py-1 px-2 rounded-full hover:bg-glass mb-1 cursor-pointer text-left whitespace-nowrap',
        {
          'font-bold': isSelected
        }
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
    </label>
  );
}
