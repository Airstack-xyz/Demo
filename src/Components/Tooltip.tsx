import classnames from 'classnames';

export const tooltipClass =
  'mt-2 px-2 py-1.5 bg-secondary rounded-18 text-xs text-text-secondary font-medium';

export function Tooltip({
  children,
  content,
  className,
  contentClassName,
  disabled = false
}: {
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <span className={classnames('relative whitespace-nowrap group', className)}>
      {children}
      {!disabled && (
        <span
          className={classnames(
            'hidden justify-center bg-primary absolute top-7 w-auto border border-stroke-color z-10 rounded-lg group-hover:flex',
            contentClassName
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
