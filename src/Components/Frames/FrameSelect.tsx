import classNames from 'classnames';
import { showToast } from '../../utils/showToast';
import { IconType } from '../Icon';
import { FrameLabel } from './FrameLabel';

export type FrameSelectOption = {
  label: string;
  value: string;
  disabledTooltip?: string;
};

export type FrameSelectOptionState = 'selected' | 'disabled' | null | undefined;

export function FrameSelect({
  label,
  labelIcon,
  labelIconSize = 16,
  containerClass,
  options,
  optionsState,
  onSelect
}: {
  label: string;
  labelIcon: IconType;
  labelIconSize?: number;
  containerClass?: string;
  options: FrameSelectOption[];
  optionsState: FrameSelectOptionState[];
  onSelect: (option: FrameSelectOption, index: number) => void;
}) {
  return (
    <div
      className={classNames(
        'text-text-secondary text-xs relative',
        containerClass
      )}
    >
      <FrameLabel
        label={label}
        labelIcon={labelIcon}
        labelIconSize={labelIconSize}
      />
      <div className="flex flex-wrap items-center gap-3">
        {options.map((option, index) => {
          const isDisabled = optionsState?.[index] === 'disabled';
          const isSelected = optionsState?.[index] === 'selected';
          return (
            <button
              key={option.value}
              type="button"
              className={classNames(
                'card flex items-center rounded-full px-4 py-2.5 text-xs font-semibold text-white',
                isSelected ? '!border-white' : 'border-transparent',
                isDisabled ? 'opacity-50' : ''
              )}
              onClick={() => {
                if (isDisabled) {
                  if (option.disabledTooltip) {
                    showToast(option.disabledTooltip, 'warning');
                  }
                  return;
                }
                onSelect(option, index);
              }}
            >
              {option?.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
