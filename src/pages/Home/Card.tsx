import { Icon, IconType } from './Icon';
import classNames from 'classnames';

export function Card({
  children,
  title,
  icon,
  className
}: {
  children: React.ReactNode;
  title: string;
  icon: IconType;
  className?: string;
}) {
  return (
    <div className={classNames('card p-7 rounded-18', className)}>
      <h3 className="text-left font-bold mb-5 flex-row-h-center">
        <Icon name={icon} /> <span className="ml-1">{title}</span>{' '}
      </h3>
      <div>{children}</div>
    </div>
  );
}
