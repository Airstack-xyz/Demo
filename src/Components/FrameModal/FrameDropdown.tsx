import classNames from 'classnames';
import { Icon, IconType } from '../Icon';
import { useCallback, useState } from 'react';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { FrameOption } from './types';

export function FrameDropdown({
  label,
  labelIcon,
  labelIconSize = 16,
  dropdownHeading,
  options,
  selectedOption,
  onSelect
}: {
  label: string;
  labelIcon: IconType;
  labelIconSize?: number;
  dropdownHeading?: string;
  options: FrameOption[];
  selectedOption?: FrameOption | null;
  onSelect: (value: FrameOption) => void;
}) {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const containerRef = useOutsideClick<HTMLDivElement>(() =>
    setDropdownVisible(false)
  );

  const toggleDropdown = useCallback(() => {
    setDropdownVisible(prev => !prev);
  }, []);

  return (
    <div ref={containerRef} className="text-text-secondary text-xs relative">
      <div className="flex items-center gap-1 mb-2">
        <Icon name={labelIcon} height={labelIconSize} width={labelIconSize} />
        <span className="font-semibold">{label}</span>
      </div>
      <button
        className={classNames(
          'bg-glass-2 flex min-w-[160px] items-center justify-between gap-2 rounded-full border border-solid border-transparent py-2.5 pl-5 pr-4',
          isDropdownVisible ? 'border-white' : ''
        )}
        onClick={toggleDropdown}
      >
        {selectedOption?.label || 'Select one'}
        <Icon name="arrow-down" height={16} width={16} />
      </button>
      {isDropdownVisible && (
        <div className="absolute top-full z-10 mt-1.5 flex min-w-[160px] flex-col gap-y-1 rounded-2xl bg-gradient-to-r from-[#3e3e41] to-[#2c2c30] py-2 pl-3 pr-5">
          {!!dropdownHeading && (
            <div className="font-bold p-1">{dropdownHeading}</div>
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
              <button
                key={option.value}
                type="button"
                className={classNames(
                  'py-1 flex items-center rounded-lg text-white text-xs',
                  isSelected ? 'font-bold' : 'hover:text-white/50'
                )}
                onClick={onClick}
              >
                <Icon
                  name="check-mark"
                  className={classNames('mr-1.5', !isSelected && 'invisible')}
                  height={10}
                  width={10}
                />
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
