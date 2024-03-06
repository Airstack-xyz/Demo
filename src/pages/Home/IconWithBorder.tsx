import classNames from 'classnames';
import { Icon, IconType } from './Icon';
import { CSSProperties } from 'react';

export type IconWithBorderProps = {
  name: IconType;
  label?: string;
  labelClass?: string;
  labelStyles?: CSSProperties;
};

export function IconWithBorder({
  name,
  label,
  labelClass,
  labelStyles
}: IconWithBorderProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="border-[3px] border-solid border-[#88B7E2] rounded-full size-14 flex items-center justify-center">
        <Icon name={name} height={35} width={35} className="rounded-full" />
      </div>
      {label && (
        <div
          style={labelStyles}
          className={classNames(
            'bg-[#3C76C4] text-xs rounded-2xl font-semibold px-2 py-0.5 -mt-1',
            labelClass
          )}
        >
          {label}
        </div>
      )}
    </div>
  );
}
