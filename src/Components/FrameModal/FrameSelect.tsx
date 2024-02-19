import { Icon, IconType } from '../Icon';
import classNames from 'classnames';
import { FrameOption } from './types';

export function FrameSelect({
  label,
  labelIcon,
  labelIconSize = 16,
  containerClass,
  options,
  selectedOptions,
  onSelect
}: {
  label: string;
  labelIcon: IconType;
  labelIconSize?: number;
  containerClass?: string;
  options: FrameOption[];
  selectedOptions?: (FrameOption | null)[];
  onSelect: (option: FrameOption, index: number) => void;
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
      <div className="flex items-center gap-3">
        {options.map((option, index) => {
          const isSelected = Boolean(
            selectedOptions?.find(o => o?.value === option.value)
          );
          return (
            <button
              key={option.value}
              type="button"
              className={classNames(
                'bg-glass-2 flex items-center rounded-full border border-solid border-transparent px-4 py-2.5 text-xs font-semibold text-white',
                isSelected ? '!border-white' : ''
              )}
              onClick={() => onSelect(option, index)}
            >
              {option?.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
