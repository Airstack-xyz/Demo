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
  onClick
}: {
  icon: IconType;
  header: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={classNames(
        'pb-3 flex min-w-[168px] max-sm:flex-1 justify-center border-b-4 border-solid border-transparent -mb-1 cursor-pointer',
        {
          '!border-text-secondary font-bold': active
        }
      )}
    >
      <div className="flex items-center">
        <Icon name={icon} className="h-5 mr-2" />
        <span className="ellipsis">{header}</span>
      </div>
    </div>
  );
}
