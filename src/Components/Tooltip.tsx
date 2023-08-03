import classnames from 'classnames';

export function Tooltip({
  children,
  content,
  className
}: {
  className?: string;
  children: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <span className={classnames('relative whitespace-nowrap group', className)}>
      {children}
      <span className="hidden justify-center bg-primary absolute top-7 w-auto border border-stroke-color z-10 rounded-lg group-hover:flex">
        {content}
      </span>
    </span>
  );
}
