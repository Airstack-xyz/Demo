import { ComponentProps } from 'react';
import { Icon, IconType } from '../Icon';
import classNames from 'classnames';

export function FrameInput({
  label,
  labelIcon,
  labelIconSize = 16,
  containerClass,
  ...rest
}: {
  label: string;
  labelIcon: IconType;
  labelIconSize?: number;
  containerClass?: string;
} & ComponentProps<'input'>) {
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
      <div className="flex items-center justify-between gap-2 min-w-[160px] py-2.5 pl-5 pr-4 bg-glass-2 rounded-full">
        <input
          type="text"
          className="w-full bg-transparent caret-white outline-none text-text-secondary text-xs"
          {...rest}
        />
      </div>
    </div>
  );
}
