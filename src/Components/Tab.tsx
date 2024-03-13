import classNames from 'classnames';
import { IconType, Icon } from './Icon';
import { ReactNode } from 'react';

export function TabContainer({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={classNames(
        'my-5 flex border-b-4 border-solid border-stroke-color',
        className
      )}
    >
      {children}
    </div>
  );
}

export function Tab({
  icon,
  header,
  active,
  className,
  onClick
}: {
  icon: IconType;
  header: string;
  active: boolean;
  className?: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={classNames(
        'pb-3 px-3 flex max-sm:flex-1 justify-center border-b-4 border-solid border-transparent -mb-1 cursor-pointer',
        {
          '!border-white font-bold': active
        },
        className
      )}
    >
      <div
        className={classNames('flex items-center overflow-hidden', {
          'invert-[0.3]': !active
        })}
      >
        <Icon name={icon} className="h-5 mr-1.5" />
        <span className="ellipsis">{header}</span>
      </div>
    </div>
  );
}
