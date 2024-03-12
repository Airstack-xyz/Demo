import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { FilterOption } from '../Filters/FilterOption';
import { Icon, IconType } from '../Icon';

export type FrameDropdownOption = {
  label: string;
  value: string;
};

export function FrameDropdown({
  heading,
  icon,
  options,
  selectedOption,
  optionsContainerClassName,
  onSelect
}: {
  heading?: string;
  icon: IconType,
  options: FrameDropdownOption[];
  selectedOption?: FrameDropdownOption | null;
  optionsContainerClassName?: string,
  onSelect: (value: FrameDropdownOption) => void;
}) {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const containerRef = useOutsideClick<HTMLDivElement>(() =>
    setDropdownVisible(false)
  );

  const toggleDropdown = useCallback(() => {
    setDropdownVisible(prev => !prev);
  }, []);

  return (
    <div
      ref={containerRef}
      className="text-xs font-medium relative"
    >
      <button
        className={classNames(
          "py-1.5 px-3 min-h-9 rounded-full bg-[#132838] text-white border border-solid border-transparent text-xs flex-row-center",
          isDropdownVisible ? 'border-white' : ''
        )}
        onClick={toggleDropdown}
      >
        <Icon name={icon} height={14} width={14} className="mr-1" />
        {selectedOption?.label || 'Select one'}
      </button>
      {isDropdownVisible && (
        <div className={classNames("bg-[#142738] rounded-18 p-1 mt-1 flex flex-col absolute min-w-[140px] left-0 top-full z-20", optionsContainerClassName)}>
          {!!heading && (
            <div className="font-bold py-2 px-3.5 rounded-full text-left whitespace-nowrap">{heading}</div>
          )}
          {options.map(option => {
            const isSelected = selectedOption?.value === option.value;
            const onClick = isSelected
              ? undefined
              : () => {
                  onSelect(option);
                  setDropdownVisible(false);
                };
            return (
              <FilterOption
                key={option.value}
                label={option.label}
                isSelected={isSelected}
                onClick={onClick}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
