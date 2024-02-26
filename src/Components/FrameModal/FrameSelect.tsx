import { showToast } from '../../utils/showToast';
import { Icon, IconType } from '../Icon';
import classNames from 'classnames';

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
      <div className="flex items-center gap-1 mb-2">
        <Icon name={labelIcon} height={labelIconSize} width={labelIconSize} />
        <span className="font-semibold">{label}</span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {options.map((option, index) => {
          const isDisabled = optionsState?.[index] === 'disabled';
          const isSelected = optionsState?.[index] === 'selected';
          return (
            <button
              key={option.value}
              type="button"
              className={classNames(
                'bg-glass-2 flex items-center rounded-full border border-solid px-4 py-2.5 text-xs font-semibold text-white',
                isSelected ? 'border-white' : 'border-transparent',
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
