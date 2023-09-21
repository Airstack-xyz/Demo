type FilterOptionProps = {
  onChange: () => void;
  isDisabled?: boolean;
  isSelected?: boolean;
  label: string;
};

export function FilterCheckbox({
  onChange,
  isDisabled,
  isSelected,
  label
}: FilterOptionProps) {
  return (
    <label className="flex items-center py-1 px-2 rounded-full mb-1 text-left whitespace-nowrap">
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
