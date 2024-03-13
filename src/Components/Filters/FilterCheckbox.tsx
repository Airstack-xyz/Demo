import classNames from 'classnames';

const filterCheckboxClass =
  'mb-1 flex items-center whitespace-nowrap rounded-full px-2 py-1 text-left';

type FilterOptionProps = {
  onChange: () => void;
  isDisabled?: boolean;
  isSelected?: boolean;
  className?: string;
  label: string;
};

export function FilterCheckbox({
  onChange,
  isDisabled,
  isSelected,
  className,
  label
}: FilterOptionProps) {
  return (
    <label className={classNames(filterCheckboxClass, className)}>
      <input
        type="checkbox"
        disabled={isDisabled}
        checked={isSelected}
        onChange={onChange}
        className="mr-1.5 scale-110 bg-transparent"
      />
      {label}
    </label>
  );
}
